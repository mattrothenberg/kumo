import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * This test validates that package.json exports point to files that actually exist
 * in the dist directory after build. This catches mismatches between configured
 * export paths and actual build output.
 */
describe("Export Path Validation (Post-Build)", () => {
  const packageJsonPath = join(__dirname, "../../package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  const distDir = join(__dirname, "../../dist");

  // Check if dist directory exists (skip tests if not built)
  const isBuilt = existsSync(distDir);

  if (!isBuilt) {
    it.skip("dist directory does not exist - run build first", () => {
      // This test suite requires the package to be built
    });
    return;
  }

  describe("Export paths point to existing files", () => {
    Object.entries(packageJson.exports).forEach(([exportPath, config]) => {
      // Skip wildcard and CSS-only exports
      if (exportPath.includes("*") || typeof config === "string") {
        return;
      }

      describe(`Export: ${exportPath}`, () => {
        const exportConfig = config as { types?: string; import?: string };

        if (exportConfig.import) {
          it("should have import path that exists in dist", () => {
            const importPath = exportConfig.import!.replace(/^\.\//, "");
            const fullPath = join(__dirname, "../../", importPath);

            if (!existsSync(fullPath)) {
              console.error(`\n❌ Import file does not exist: ${importPath}`);
              console.error(`   Expected at: ${fullPath}`);
              console.error(`   Export: ${exportPath}`);
            }

            expect(existsSync(fullPath)).toBe(true);
          });
        }

        if (exportConfig.types) {
          it("should have types path that exists in dist", () => {
            const typesPath = exportConfig.types!.replace(/^\.\//, "");
            const fullPath = join(__dirname, "../../", typesPath);

            if (!existsSync(fullPath)) {
              console.error(`\n❌ Types file does not exist: ${typesPath}`);
              console.error(`   Expected at: ${fullPath}`);
              console.error(`   Export: ${exportPath}`);
            }

            expect(existsSync(fullPath)).toBe(true);
          });
        }
      });
    });
  });

  describe("Build output structure validation", () => {
    it("should have consistent structure between JS and types", () => {
      const exports = packageJson.exports;
      const inconsistencies: string[] = [];

      Object.entries(exports).forEach(([exportPath, config]) => {
        if (typeof config === "string" || exportPath.includes("*")) {
          return;
        }

        const exportConfig = config as { types?: string; import?: string };

        if (exportConfig.import && exportConfig.types) {
          const importPath = exportConfig.import;
          const typesPath = exportConfig.types;

          // Check if paths follow expected patterns
          // JS files should be in dist/[category]/[name].js
          // Type files should be in dist/src/[category]/[name]/index.d.ts

          const jsMatch = importPath.match(/^\.\/dist\/([^/]+)\/(.+)\.js$/);
          const tsMatch = typesPath.match(
            /^\.\/dist\/src\/([^/]+)\/(.+)\/index\.d\.ts$/,
          );

          if (jsMatch && tsMatch) {
            const [, jsCategory, jsName] = jsMatch;
            const [, tsCategory, tsName] = tsMatch;

            if (jsCategory !== tsCategory || jsName !== tsName) {
              inconsistencies.push(
                `${exportPath}: JS (${jsCategory}/${jsName}) doesn't match Types (${tsCategory}/${tsName})`,
              );
            }
          } else if (
            !importPath.includes("index.js") &&
            !typesPath.includes("index.d.ts")
          ) {
            // For non-standard paths, just warn
            console.warn(`\n⚠️  Non-standard path structure for ${exportPath}`);
            console.warn(`   Import: ${importPath}`);
            console.warn(`   Types:  ${typesPath}`);
          }
        }
      });

      if (inconsistencies.length > 0) {
        console.error("\n❌ Inconsistencies found between JS and Types paths:");
        inconsistencies.forEach((msg) => console.error(`   ${msg}`));
      }

      expect(inconsistencies).toEqual([]);
    });
  });

  describe("Vite build configuration alignment", () => {
    it("should have matching structure between vite config and package.json exports", () => {
      const viteConfigPath = join(__dirname, "../../vite.config.ts");
      const viteConfigContent = readFileSync(viteConfigPath, "utf-8");

      // Check if preserveModules is enabled
      const hasPreserveModules = viteConfigContent.includes(
        "preserveModules: true",
      );

      if (hasPreserveModules) {
        // With preserveModules, build output is flattened
        // JS: dist/components/button.js
        // Types: dist/src/components/button/index.d.ts (from vite-plugin-dts)

        const exports = packageJson.exports;
        const mismatches: string[] = [];

        Object.entries(exports).forEach(([exportPath, config]) => {
          if (
            typeof config === "string" ||
            exportPath.includes("*") ||
            exportPath === "."
          ) {
            return;
          }

          const exportConfig = config as { types?: string; import?: string };

          // Extract component/block/layout name from export path
          const match = exportPath.match(
            /^\.\/(?:components|blocks|layouts)\/(.+)$/,
          );
          if (!match) return;

          const [, name] = match;
          const category = exportPath.split("/")[1]; // components, blocks, or layouts

          // Expected paths with preserveModules
          const expectedImport = `./dist/${category}/${name}.js`;
          const expectedTypes = `./dist/src/${category}/${name}/index.d.ts`;

          if (exportConfig.import !== expectedImport) {
            mismatches.push(
              `${exportPath} import path mismatch:\n` +
                `  Expected: ${expectedImport}\n` +
                `  Actual:   ${exportConfig.import}`,
            );
          }

          if (exportConfig.types !== expectedTypes) {
            mismatches.push(
              `${exportPath} types path mismatch:\n` +
                `  Expected: ${expectedTypes}\n` +
                `  Actual:   ${exportConfig.types}`,
            );
          }
        });

        if (mismatches.length > 0) {
          console.error(
            "\n❌ Export paths do not match vite build configuration:",
          );
          mismatches.forEach((msg) => console.error(`   ${msg}`));
        }

        expect(mismatches).toEqual([]);
      }
    });
  });
});
