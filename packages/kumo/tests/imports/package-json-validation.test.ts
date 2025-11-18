import { describe, it, expect } from 'vitest';
import { discoverComponents, getComponentsWithExports, discoverBlocks, getBlocksWithExports, discoverLayouts, getLayoutsWithExports } from './test-utils';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Package.json Validation', () => {
  const allComponents = discoverComponents();
  const componentsWithExports = getComponentsWithExports();
  const allBlocks = discoverBlocks();
  const blocksWithExports = getBlocksWithExports();
  const allLayouts = discoverLayouts();
  const layoutsWithExports = getLayoutsWithExports();
  const packageJsonPath = join(__dirname, '../../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  describe('Export completeness', () => {
    it('should have exports for all components in src/components', () => {
      const missingExports = allComponents.filter(
        (component: string) => !componentsWithExports.includes(component)
      );

      if (missingExports.length > 0) {
        console.error('\n❌ Components missing from package.json exports:');
        missingExports.forEach((name: string) => {
          console.error(`   - ${name}`);
          console.error(`     Add this to package.json exports:`);
          console.error(`     "./components/${name}": {`);
          console.error(`       "types": "./dist/components/${name}/index.d.ts",`);
          console.error(`       "import": "./dist/components/${name}/index.js"`);
          console.error(`     }`);
        });
      }

      expect(missingExports).toEqual([]);
      expect(missingExports.length).toBe(0);
    });

    it('should have exports for all blocks in src/blocks', () => {
      const missingExports = allBlocks.filter(
        (block: string) => !blocksWithExports.includes(block)
      );

      if (missingExports.length > 0) {
        console.error('\n❌ Blocks missing from package.json exports:');
        missingExports.forEach((name: string) => {
          console.error(`   - ${name}`);
          console.error(`     Add this to package.json exports:`);
          console.error(`     "./blocks/${name}": {`);
          console.error(`       "types": "./dist/blocks/${name}/index.d.ts",`);
          console.error(`       "import": "./dist/blocks/${name}/index.js"`);
          console.error(`     }`);
        });
      }

      expect(missingExports).toEqual([]);
      expect(missingExports.length).toBe(0);
    });

    it('should not have exports for non-existent components', () => {
      const invalidExports = componentsWithExports.filter(
        (component: string) => !allComponents.includes(component)
      );

      if (invalidExports.length > 0) {
        console.error('\n❌ Package.json exports reference non-existent components:');
        invalidExports.forEach((name: string) => {
          console.error(`   - ${name} (no directory at src/components/${name})`);
        });
      }

      expect(invalidExports).toEqual([]);
      expect(invalidExports.length).toBe(0);
    });

    it('should not have exports for non-existent blocks', () => {
      const invalidExports = blocksWithExports.filter(
        (block: string) => !allBlocks.includes(block)
      );

      if (invalidExports.length > 0) {
        console.error('\n❌ Package.json exports reference non-existent blocks:');
        invalidExports.forEach((name: string) => {
          console.error(`   - ${name} (no directory at src/blocks/${name})`);
        });
      }

      expect(invalidExports).toEqual([]);
      expect(invalidExports.length).toBe(0);
    });

    it('should have exports for all layouts in src/layouts', () => {
      const missingExports = allLayouts.filter(
        (layout: string) => !layoutsWithExports.includes(layout)
      );

      if (missingExports.length > 0) {
        console.error('\n❌ Layouts missing from package.json exports:');
        missingExports.forEach((name: string) => {
          console.error(`   - ${name}`);
          console.error(`     Add this to package.json exports:`);
          console.error(`     "./layouts/${name}": {`);
          console.error(`       "types": "./dist/layouts/${name}/index.d.ts",`);
          console.error(`       "import": "./dist/layouts/${name}/index.js"`);
          console.error(`     }`);
        });
      }

      expect(missingExports).toEqual([]);
      expect(missingExports.length).toBe(0);
    });

    it('should not have exports for non-existent layouts', () => {
      const invalidExports = layoutsWithExports.filter(
        (layout: string) => !allLayouts.includes(layout)
      );

      if (invalidExports.length > 0) {
        console.error('\n❌ Package.json exports reference non-existent layouts:');
        invalidExports.forEach((name: string) => {
          console.error(`   - ${name} (no directory at src/layouts/${name})`);
        });
      }

      expect(invalidExports).toEqual([]);
      expect(invalidExports.length).toBe(0);
    });
  });

  describe('Export format validation', () => {
    componentsWithExports.forEach((componentName: string) => {
      describe(`Component: ${componentName}`, () => {
        const exportPath = `./components/${componentName}`;
        const exportConfig = packageJson.exports[exportPath];

        it('should have a properly formatted export entry', () => {
          expect(exportConfig).toBeDefined();
          expect(exportConfig).toHaveProperty('types');
          expect(exportConfig).toHaveProperty('import');
        });

        it('should have correct types path', () => {
          const expectedTypesPath = `./dist/components/${componentName}/index.d.ts`;
          expect(exportConfig.types).toBe(expectedTypesPath);
        });

        it('should have correct import path', () => {
          const expectedImportPath = `./dist/components/${componentName}/index.js`;
          expect(exportConfig.import).toBe(expectedImportPath);
        });
      });
    });

    blocksWithExports.forEach((blockName: string) => {
      describe(`Block: ${blockName}`, () => {
        const exportPath = `./blocks/${blockName}`;
        const exportConfig = packageJson.exports[exportPath];

        it('should have a properly formatted export entry', () => {
          expect(exportConfig).toBeDefined();
          expect(exportConfig).toHaveProperty('types');
          expect(exportConfig).toHaveProperty('import');
        });

        it('should have correct types path', () => {
          const expectedTypesPath = `./dist/blocks/${blockName}/index.d.ts`;
          expect(exportConfig.types).toBe(expectedTypesPath);
        });

        it('should have correct import path', () => {
          const expectedImportPath = `./dist/blocks/${blockName}/index.js`;
          expect(exportConfig.import).toBe(expectedImportPath);
        });
      });
    });

    layoutsWithExports.forEach((layoutName: string) => {
      describe(`Layout: ${layoutName}`, () => {
        const exportPath = `./layouts/${layoutName}`;
        const exportConfig = packageJson.exports[exportPath];

        it('should have a properly formatted export entry', () => {
          expect(exportConfig).toBeDefined();
          expect(exportConfig).toHaveProperty('types');
          expect(exportConfig).toHaveProperty('import');
        });

        it('should have correct types path', () => {
          const expectedTypesPath = `./dist/layouts/${layoutName}/index.d.ts`;
          expect(exportConfig.types).toBe(expectedTypesPath);
        });

        it('should have correct import path', () => {
          const expectedImportPath = `./dist/layouts/${layoutName}/index.js`;
          expect(exportConfig.import).toBe(expectedImportPath);
        });
      });
    });
  });

  describe('Required exports', () => {
    it('should have main entry point export', () => {
      expect(packageJson.exports).toHaveProperty('.');
      expect(packageJson.exports['.']).toHaveProperty('types');
      expect(packageJson.exports['.']).toHaveProperty('import');
    });

    it('should have utils export', () => {
      expect(packageJson.exports).toHaveProperty('./utils');
      expect(packageJson.exports['./utils']).toHaveProperty('types');
      expect(packageJson.exports['./utils']).toHaveProperty('import');
    });

    it('should have styles exports', () => {
      expect(packageJson.exports).toHaveProperty('./styles');
      expect(packageJson.exports).toHaveProperty('./styles/*');
    });
  });

  describe('Build configuration consistency', () => {
    it('should have vite.config.ts entry for every component export', async () => {
      // Read vite config to check build entries
      const viteConfigPath = join(__dirname, '../../vite.config.ts');
      const viteConfigContent = readFileSync(viteConfigPath, 'utf-8');

      const missingBuildEntries: string[] = [];
      
      componentsWithExports.forEach((componentName: string) => {
        const buildEntryPattern = `'components/${componentName}'`;
        if (!viteConfigContent.includes(buildEntryPattern)) {
          missingBuildEntries.push(componentName);
        }
      });

      if (missingBuildEntries.length > 0) {
        console.error('\n❌ Components missing from vite.config.ts build entries:');
        missingBuildEntries.forEach((name: string) => {
          console.error(`   - ${name}`);
        });
      }

      expect(missingBuildEntries).toEqual([]);
    });

    it('should have vite.config.ts entry for every block export', async () => {
      // Read vite config to check build entries
      const viteConfigPath = join(__dirname, '../../vite.config.ts');
      const viteConfigContent = readFileSync(viteConfigPath, 'utf-8');

      const missingBuildEntries: string[] = [];
      
      blocksWithExports.forEach((blockName: string) => {
        const buildEntryPattern = `'blocks/${blockName}'`;
        if (!viteConfigContent.includes(buildEntryPattern)) {
          missingBuildEntries.push(blockName);
        }
      });

      if (missingBuildEntries.length > 0) {
        console.error('\n❌ Blocks missing from vite.config.ts build entries:');
        missingBuildEntries.forEach((name: string) => {
          console.error(`   - ${name}`);
        });
      }

      expect(missingBuildEntries).toEqual([]);
    });

    it('should have vite.config.ts entry for every layout export', async () => {
      // Read vite config to check build entries
      const viteConfigPath = join(__dirname, '../../vite.config.ts');
      const viteConfigContent = readFileSync(viteConfigPath, 'utf-8');

      const missingBuildEntries: string[] = [];
      
      layoutsWithExports.forEach((layoutName: string) => {
        const buildEntryPattern = `'layouts/${layoutName}'`;
        if (!viteConfigContent.includes(buildEntryPattern)) {
          missingBuildEntries.push(layoutName);
        }
      });

      if (missingBuildEntries.length > 0) {
        console.error('\n❌ Layouts missing from vite.config.ts build entries:');
        missingBuildEntries.forEach((name: string) => {
          console.error(`   - ${name}`);
        });
      }

      expect(missingBuildEntries).toEqual([]);
    });
  });

  describe('Package.json structure', () => {
    it('should have required fields', () => {
      expect(packageJson).toHaveProperty('name');
      expect(packageJson).toHaveProperty('version');
      expect(packageJson).toHaveProperty('type');
      expect(packageJson).toHaveProperty('main');
      expect(packageJson).toHaveProperty('module');
      expect(packageJson).toHaveProperty('types');
      expect(packageJson).toHaveProperty('exports');
      expect(packageJson).toHaveProperty('files');
    });

    it('should be configured as ES module', () => {
      expect(packageJson.type).toBe('module');
    });

    it('should include dist in files array', () => {
      expect(packageJson.files).toContain('dist');
    });
  });
});
