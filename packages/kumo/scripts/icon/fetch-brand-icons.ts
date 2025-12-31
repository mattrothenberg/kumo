/**
 * Fetch brand icons from Figma API
 *
 * One-time script to download brand icons from Figma Icon Library page.
 * Stores SVGs in src/assets/icons/brand/ with cf-* naming convention.
 *
 * Usage:
 *   npx tsx packages/kumo/scripts/icon/fetch-brand-icons.ts
 *
 * Requirements:
 *   - FIGMA_TOKEN in packages/kumo/scripts/figma/.env
 */

import * as fs from "fs/promises";
import * as https from "https";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_ID = "f15DmkwRAbKFbZLSQErUos";
const ICON_LIBRARY_PAGE = "Icon Library";
const OUTPUT_DIR = path.resolve(__dirname, "../../src/assets/icons/brand");

interface FigmaComponent {
  node_id: string;
  name: string;
  containing_frame?: {
    pageName?: string;
  };
}

interface FigmaComponentsResponse {
  error: boolean;
  status: number;
  meta: {
    components: FigmaComponent[];
  };
}

interface FigmaSvgResponse {
  err: string | null;
  images: Record<string, string>;
}

/**
 * Load environment variables from .env file
 */
async function loadEnv(): Promise<void> {
  const envPath = path.resolve(__dirname, "../figma/.env");
  try {
    const envContent = await fs.readFile(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim();
      }
    });
  } catch {
    throw new Error(
      `Failed to load .env file at ${envPath}. Ensure scripts/figma/.env exists with FIGMA_TOKEN set.`,
    );
  }
}

/**
 * Convert component name to kebab-case with cf- prefix
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/**
 * Fetch components from Figma file
 */
async function fetchComponents(
  token: string,
): Promise<FigmaComponentsResponse> {
  const uri = `https://api.figma.com/v1/files/${FILE_ID}/components`;
  const response = await fetch(uri, {
    headers: {
      "X-Figma-Token": token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Figma API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Fetch SVG URLs for component node IDs
 */
async function fetchSvgUrls(
  nodeIds: string[],
  token: string,
): Promise<FigmaSvgResponse> {
  const ids = nodeIds.join(",");
  const uri = `https://api.figma.com/v1/images/${FILE_ID}?ids=${ids}&format=svg`;
  const response = await fetch(uri, {
    headers: {
      "X-Figma-Token": token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Figma API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * Download SVG from URL
 */
async function downloadSvg(url: string, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const chunks: Buffer[] = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", async () => {
            try {
              await fs.writeFile(filePath, Buffer.concat(chunks));
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        } else {
          reject(
            new Error(
              `Failed to download SVG: ${response.statusCode} ${response.statusMessage}`,
            ),
          );
        }
      })
      .on("error", reject);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log("Fetching brand icons from Figma...\n");

  // Load environment variables
  await loadEnv();

  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error(
      "FIGMA_TOKEN not found in environment. Please set it in packages/kumo/scripts/figma/.env",
    );
  }

  // Fetch all components
  console.log("1. Fetching components list...");
  const componentsData = await fetchComponents(token);

  // Filter to Icon Library page
  const iconComponents = componentsData.meta.components.filter(
    (c) => c.containing_frame?.pageName === ICON_LIBRARY_PAGE,
  );

  console.log(
    `   Found ${iconComponents.length} icons in ${ICON_LIBRARY_PAGE} page\n`,
  );

  if (iconComponents.length === 0) {
    console.log("No icons found. Exiting.");
    return;
  }

  // Fetch SVG URLs
  console.log("2. Fetching SVG URLs...");
  const nodeIds = iconComponents.map((c) => c.node_id);
  const svgData = await fetchSvgUrls(nodeIds, token);

  if (svgData.err) {
    throw new Error(`Figma API error: ${svgData.err}`);
  }

  // Create output directory
  console.log(`3. Creating output directory: ${OUTPUT_DIR}\n`);
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Download SVGs
  console.log("4. Downloading SVGs...");
  let downloaded = 0;
  let failed = 0;

  for (const component of iconComponents) {
    const svgUrl = svgData.images[component.node_id];
    if (!svgUrl) {
      console.log(`   ⚠️  No SVG URL for: ${component.name}`);
      failed++;
      continue;
    }

    const fileName = `cf-${toKebabCase(component.name)}.svg`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    try {
      await downloadSvg(svgUrl, filePath);
      console.log(`   ✓ ${fileName}`);
      downloaded++;
    } catch (err) {
      console.log(`   ✗ ${fileName}: ${err}`);
      failed++;
    }
  }

  console.log(`\nComplete!`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
