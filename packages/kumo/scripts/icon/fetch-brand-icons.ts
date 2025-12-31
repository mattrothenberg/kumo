/**
 * Fetch brand icons from Figma API
 *
 * Downloads brand icons from Figma Icon Library file.
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
const ICONS_PAGE_ID = "45:2511"; // "Icons" page in the Figma file
const OUTPUT_DIR = path.resolve(__dirname, "../../src/assets/icons/brand");

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

interface FigmaNodesResponse {
  err: string | null;
  nodes: Record<
    string,
    {
      document: FigmaNode;
    }
  >;
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
    .replace(/_/g, "-")
    .toLowerCase();
}

/**
 * Fetch nodes from a specific page in the Figma file
 */
async function fetchPageNodes(token: string): Promise<FigmaNodesResponse> {
  const uri = `https://api.figma.com/v1/files/${FILE_ID}/nodes?ids=${ICONS_PAGE_ID}&depth=2`;
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
 * Fetch SVG URLs for node IDs (batched to avoid URL length limits)
 */
async function fetchSvgUrls(
  nodeIds: string[],
  token: string,
): Promise<Record<string, string>> {
  const allImages: Record<string, string> = {};
  const batchSize = 50; // Figma recommends batching

  for (let i = 0; i < nodeIds.length; i += batchSize) {
    const batch = nodeIds.slice(i, i + batchSize);
    const ids = batch.join(",");
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

    const data: FigmaSvgResponse = await response.json();
    if (data.err) {
      throw new Error(`Figma API error: ${data.err}`);
    }

    Object.assign(allImages, data.images);

    // Progress indicator
    console.log(
      `   Fetched SVG URLs: ${Math.min(i + batchSize, nodeIds.length)}/${nodeIds.length}`,
    );
  }

  return allImages;
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

  // Fetch page nodes
  console.log("1. Fetching Icons page from Figma...");
  const nodesData = await fetchPageNodes(token);

  if (nodesData.err) {
    throw new Error(`Figma API error: ${nodesData.err}`);
  }

  const pageNode = nodesData.nodes[ICONS_PAGE_ID]?.document;
  if (!pageNode || !pageNode.children) {
    throw new Error(`Could not find Icons page (${ICONS_PAGE_ID})`);
  }

  // Filter to COMPONENT nodes only
  const iconComponents = pageNode.children.filter(
    (node) => node.type === "COMPONENT",
  );

  console.log(`   Found ${iconComponents.length} icon components\n`);

  if (iconComponents.length === 0) {
    console.log("No icons found. Exiting.");
    return;
  }

  // Fetch SVG URLs
  console.log("2. Fetching SVG URLs...");
  const nodeIds = iconComponents.map((c) => c.id);
  const svgUrls = await fetchSvgUrls(nodeIds, token);
  console.log("");

  // Create output directory
  console.log(`3. Creating output directory: ${OUTPUT_DIR}\n`);
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Download SVGs
  console.log("4. Downloading SVGs...");
  let downloaded = 0;
  let failed = 0;

  for (const component of iconComponents) {
    const svgUrl = svgUrls[component.id];
    if (!svgUrl) {
      console.log(`   ⚠️  No SVG URL for: ${component.name}`);
      failed++;
      continue;
    }

    const fileName = `cf-${toKebabCase(component.name)}.svg`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    try {
      await downloadSvg(svgUrl, filePath);
      downloaded++;
      // Progress every 50 icons
      if (downloaded % 50 === 0) {
        console.log(`   Downloaded: ${downloaded}/${iconComponents.length}`);
      }
    } catch (err) {
      console.log(`   ✗ ${fileName}: ${err}`);
      failed++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ✓ Brand icons fetch complete!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log(`\nRun 'pnpm build:icons' to rebuild the sprite.`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
