import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: {
        // Main entry point
        index: resolve(__dirname, 'src/index.ts'),
        // Component entry points
        'components/badge': resolve(__dirname, 'src/components/badge/index.ts'),
        'components/banner': resolve(__dirname, 'src/components/banner/index.ts'),
        'components/button': resolve(__dirname, 'src/components/button/index.ts'),
        'components/calendar': resolve(__dirname, 'src/components/calendar/index.ts'),
        'components/checkbox': resolve(__dirname, 'src/components/checkbox/index.ts'),
        'components/clipboard-text': resolve(__dirname, 'src/components/clipboard-text/index.ts'),
        'components/code': resolve(__dirname, 'src/components/code/index.ts'),
        'components/combobox': resolve(__dirname, 'src/components/combobox/index.ts'),
        'components/dialog': resolve(__dirname, 'src/components/dialog/index.ts'),
        'components/dropdown': resolve(__dirname, 'src/components/dropdown/index.ts'),
        'components/expandable': resolve(__dirname, 'src/components/expandable/index.ts'),
        'components/field': resolve(__dirname, 'src/components/field/index.ts'),
        'components/input': resolve(__dirname, 'src/components/input/index.ts'),
        'components/layer-card': resolve(__dirname, 'src/components/layer-card/index.ts'),
        'components/loader': resolve(__dirname, 'src/components/loader/index.ts'),
        'components/menubar': resolve(__dirname, 'src/components/menubar/index.ts'),
        'components/meter': resolve(__dirname, 'src/components/meter/index.ts'),
        'components/pagination': resolve(__dirname, 'src/components/pagination/index.ts'),
        'components/select': resolve(__dirname, 'src/components/select/index.ts'),
        'components/surface': resolve(__dirname, 'src/components/surface/index.ts'),
        'components/switch': resolve(__dirname, 'src/components/switch/index.ts'),
        'components/tabs': resolve(__dirname, 'src/components/tabs/index.ts'),
        'components/text': resolve(__dirname, 'src/components/text/index.ts'),
        'components/toast': resolve(__dirname, 'src/components/toast/index.ts'),
        'components/tooltip': resolve(__dirname, 'src/components/tooltip/index.ts'),
        // PLOP_INJECT_COMPONENT_ENTRY
        // Block entry points
        'blocks/breadcrumbs': resolve(__dirname, 'src/blocks/breadcrumbs/index.ts'),
        'blocks/empty': resolve(__dirname, 'src/blocks/empty/index.ts'),
        'blocks/page-header': resolve(__dirname, 'src/blocks/page-header/index.ts'),
        // PLOP_INJECT_BLOCK_ENTRY
        // Layout entry points
        'layouts/resource-list': resolve(__dirname, 'src/layouts/resource-list/index.ts'),
        // PLOP_INJECT_LAYOUT_ENTRY
        // Utils entry point
        'utils': resolve(__dirname, 'src/utils/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => {
        return `${entryName}.js`;
      },
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: (id) => {
        // Externalize all node_modules dependencies
        return !id.startsWith('.') && !id.startsWith('/');
      },
      output: {
        // Preserve module structure for better tree-shaking and debugging
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Global variables for UMD build (if needed)
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    sourcemap: true,
    // Ensure output directory is clean
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
