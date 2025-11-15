import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, '../src/styles');
const distDir = join(__dirname, '../dist/styles');

// Create dist/styles directory if it doesn't exist
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Copy CSS files
const cssFiles: string[] = ['kumo.css', 'kumo-binding.css'];

cssFiles.forEach((file) => {
  const srcPath = join(srcDir, file);
  const distPath = join(distDir, file);
  
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, distPath);
    console.log(`✓ Copied ${file} to dist/styles/`);
  } else {
    console.warn(`⚠ Warning: ${file} not found in src/styles/`);
  }
});

console.log('✅ CSS build complete');
