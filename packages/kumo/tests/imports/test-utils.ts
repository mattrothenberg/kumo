import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ComponentInfo {
  name: string;
  path: string;
  exports: string[];
}

/**
 * Discover all component directories in src/components
 */
export function discoverComponents(): string[] {
  const componentsDir = join(__dirname, '../../src/components');
  const entries = readdirSync(componentsDir);
  
  return entries.filter((entry: string) => {
    const fullPath = join(componentsDir, entry);
    return statSync(fullPath).isDirectory();
  });
}

/**
 * Discover all block directories in src/blocks
 */
export function discoverBlocks(): string[] {
  const blocksDir = join(__dirname, '../../src/blocks');
  const entries = readdirSync(blocksDir);
  
  return entries.filter((entry: string) => {
    const fullPath = join(blocksDir, entry);
    return statSync(fullPath).isDirectory();
  });
}

/**
 * Discover all layout directories in src/layouts
 */
export function discoverLayouts(): string[] {
  const layoutsDir = join(__dirname, '../../src/layouts');
  const entries = readdirSync(layoutsDir);
  
  return entries.filter((entry: string) => {
    const fullPath = join(layoutsDir, entry);
    return statSync(fullPath).isDirectory();
  });
}

/**
 * Get the list of components that have exports configured in package.json
 * Dynamically reads from package.json exports field
 */
export function getComponentsWithExports(): string[] {
  const packageJsonPath = join(__dirname, '../../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  const componentExports: string[] = [];
  
  if (packageJson.exports) {
    for (const exportPath of Object.keys(packageJson.exports)) {
      // Match patterns like "./components/button"
      const match = exportPath.match(/^\.\/components\/(.+)$/);
      if (match) {
        componentExports.push(match[1]);
      }
    }
  }
  
  return componentExports.sort();
}

/**
 * Get the list of blocks that have exports configured in package.json
 * Dynamically reads from package.json exports field
 */
export function getBlocksWithExports(): string[] {
  const packageJsonPath = join(__dirname, '../../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  const blockExports: string[] = [];
  
  if (packageJson.exports) {
    for (const exportPath of Object.keys(packageJson.exports)) {
      // Match patterns like "./blocks/breadcrumbs"
      const match = exportPath.match(/^\.\/blocks\/(.+)$/);
      if (match) {
        blockExports.push(match[1]);
      }
    }
  }
  
  return blockExports.sort();
}

/**
 * Get the list of layouts that have exports configured in package.json
 * Dynamically reads from package.json exports field
 */
export function getLayoutsWithExports(): string[] {
  const packageJsonPath = join(__dirname, '../../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  const layoutExports: string[] = [];
  
  if (packageJson.exports) {
    for (const exportPath of Object.keys(packageJson.exports)) {
      // Match patterns like "./layouts/resource-list"
      const match = exportPath.match(/^\.\/layouts\/(.+)$/);
      if (match) {
        layoutExports.push(match[1]);
      }
    }
  }
  
  return layoutExports.sort();
}

/**
 * Get all exports from the main entry point
 * Dynamically imports and extracts all named exports
 */
export async function getMainEntryExports(): Promise<string[]> {
  const module = await import('../../src/index.ts');
  
  // Get all exports except 'default'
  return Object.keys(module)
    .filter(key => key !== 'default')
    .sort();
}
