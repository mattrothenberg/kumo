// Type declaration for Vite's ?raw import suffix
declare module "*.md?raw" {
  const content: string;
  export default content;
}

// Specific declaration for component-registry.md
declare module "../../dist/ai/component-registry.md?raw" {
  const content: string;
  export default content;
}

// Type declaration for SVG sprite asset
declare module "*.svg" {
  const content: string;
  export default content;
}
