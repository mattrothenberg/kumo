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
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        // Main entry point
        index: resolve(__dirname, 'src/index.ts'),
        // Component entry points (only migrated components)
        'components/badge': resolve(__dirname, 'src/components/badge/index.ts'),
        'components/button': resolve(__dirname, 'src/components/button/index.ts'),
        'components/input': resolve(__dirname, 'src/components/input/index.ts'),
        'components/loader': resolve(__dirname, 'src/components/loader/index.ts'),
        'components/surface': resolve(__dirname, 'src/components/surface/index.ts'),
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
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@base-ui-components/react',
        '@phosphor-icons/react',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        // Preserve module structure for better tree-shaking
        preserveModules: false,
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
