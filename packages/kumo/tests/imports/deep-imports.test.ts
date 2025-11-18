import { describe, it, expect } from 'vitest';
import { discoverComponents, getComponentsWithExports, discoverBlocks, getBlocksWithExports, discoverLayouts, getLayoutsWithExports } from './test-utils';

describe('Deep Import Patterns', () => {
  const allComponents = discoverComponents();
  const componentsWithExports = getComponentsWithExports();
  const allBlocks = discoverBlocks();
  const blocksWithExports = getBlocksWithExports();
  const allLayouts = discoverLayouts();
  const layoutsWithExports = getLayoutsWithExports();

  describe('Components with configured exports', () => {
    componentsWithExports.forEach((componentName: string) => {
      it(`should import from @cloudflare/kumo/components/${componentName}`, async () => {
        expect(async () => {
          const module = await import(`../../src/components/${componentName}/index.ts`);
          expect(module).toBeDefined();
          expect(Object.keys(module).length).toBeGreaterThan(0);
        }).not.toThrow();
      });
    });
  });

  describe('Blocks with configured exports', () => {
    blocksWithExports.forEach((blockName: string) => {
      it(`should import from @cloudflare/kumo/blocks/${blockName}`, async () => {
        expect(async () => {
          const module = await import(`../../src/blocks/${blockName}/index.ts`);
          expect(module).toBeDefined();
          expect(Object.keys(module).length).toBeGreaterThan(0);
        }).not.toThrow();
      });
    });
  });

  describe('All components should have configured exports', () => {
    const componentsWithoutExports = allComponents.filter(
      name => !componentsWithExports.includes(name)
    );

    it('should have all components configured in package.json exports', () => {
      if (componentsWithoutExports.length > 0) {
        console.warn('\n⚠️  Components missing from package.json exports:');
        componentsWithoutExports.forEach((name: string) => {
          console.warn(`   - ${name}`);
        });
      } else {
        console.log('\n✅ All components have configured exports!');
      }

      // All components should have exports configured
      expect(componentsWithoutExports.length).toBe(0);
      expect(componentsWithoutExports).toEqual([]);
    });
  });

  describe('All blocks should have configured exports', () => {
    const blocksWithoutExports = allBlocks.filter(
      name => !blocksWithExports.includes(name)
    );

    it('should have all blocks configured in package.json exports', () => {
      if (blocksWithoutExports.length > 0) {
        console.warn('\n⚠️  Blocks missing from package.json exports:');
        blocksWithoutExports.forEach((name: string) => {
          console.warn(`   - ${name}`);
        });
      } else {
        console.log('\n✅ All blocks have configured exports!');
      }

      // All blocks should have exports configured
      expect(blocksWithoutExports.length).toBe(0);
      expect(blocksWithoutExports).toEqual([]);
    });
  });

  describe('All components should have index.ts', () => {
    allComponents.forEach((componentName: string) => {
      it(`${componentName} should have an index.ts file`, async () => {
        expect(async () => {
          await import(`../../src/components/${componentName}/index.ts`);
        }).not.toThrow();
      });
    });
  });

  describe('All blocks should have index.ts', () => {
    allBlocks.forEach((blockName: string) => {
      it(`${blockName} should have an index.ts file`, async () => {
        expect(async () => {
          await import(`../../src/blocks/${blockName}/index.ts`);
        }).not.toThrow();
      });
    });
  });

  describe('Layouts with configured exports', () => {
    layoutsWithExports.forEach((layoutName: string) => {
      it(`should import from @cloudflare/kumo/layouts/${layoutName}`, async () => {
        expect(async () => {
          const module = await import(`../../src/layouts/${layoutName}/index.ts`);
          expect(module).toBeDefined();
          expect(Object.keys(module).length).toBeGreaterThan(0);
        }).not.toThrow();
      });
    });
  });

  describe('All layouts should have configured exports', () => {
    const layoutsWithoutExports = allLayouts.filter(
      name => !layoutsWithExports.includes(name)
    );

    it('should have all layouts configured in package.json exports', () => {
      if (layoutsWithoutExports.length > 0) {
        console.warn('\n⚠️  Layouts missing from package.json exports:');
        layoutsWithoutExports.forEach((name: string) => {
          console.warn(`   - ${name}`);
        });
      } else {
        console.log('\n✅ All layouts have configured exports!');
      }

      // All layouts should have exports configured
      expect(layoutsWithoutExports.length).toBe(0);
      expect(layoutsWithoutExports).toEqual([]);
    });
  });

  describe('All layouts should have index.ts', () => {
    allLayouts.forEach((layoutName: string) => {
      it(`${layoutName} should have an index.ts file`, async () => {
        expect(async () => {
          await import(`../../src/layouts/${layoutName}/index.ts`);
        }).not.toThrow();
      });
    });
  });
});
