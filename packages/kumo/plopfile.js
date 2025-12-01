import fs from "fs";

export default function (plop) {
  // Custom action to modify JSON files
  plop.setActionType("modify-json", (answers, config) => {
    const filePath = config.path;
    const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const modifiedJson = config.transform(packageJson);
    fs.writeFileSync(
      filePath,
      JSON.stringify(modifiedJson, null, "\t") + "\n",
      "utf8",
    );
    return `Modified ${filePath}`;
  });

  // Component generator
  plop.setGenerator("component", {
    description: "Create a new component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: 'Component name (e.g., "My Component" or "my-component"):',
        validate: (value) => {
          if (!value) return "Component name is required";
          if (value.length < 2)
            return "Component name must be at least 2 characters";
          return true;
        },
      },
    ],
    actions: (data) => {
      const actions = [];
      const kebabName = plop.getHelper("kebabCase")(data.name);
      const pascalName = plop.getHelper("pascalCase")(data.name);

      // 1. Create component file
      actions.push({
        type: "add",
        path: "src/components/{{kebabCase name}}/{{kebabCase name}}.tsx",
        templateFile: "plop-templates/component.tsx.hbs",
      });

      // 2. Create index file
      actions.push({
        type: "add",
        path: "src/components/{{kebabCase name}}/index.ts",
        templateFile: "plop-templates/index.ts.hbs",
      });

      // 3. Create story file
      actions.push({
        type: "add",
        path: "src/components/{{kebabCase name}}/{{kebabCase name}}.stories.tsx",
        templateFile: "plop-templates/component.stories.tsx.hbs",
      });

      // 4. Create test file
      actions.push({
        type: "add",
        path: "src/components/{{kebabCase name}}/{{kebabCase name}}.test.tsx",
        templateFile: "plop-templates/component.test.tsx.hbs",
      });

      // 5. Update main index.ts - insert BEFORE marker
      actions.push({
        type: "modify",
        path: "src/index.ts",
        pattern: /(\/\/ PLOP_INJECT_EXPORT)/,
        template: `export { ${pascalName}, type ${pascalName}Props } from "./components/${kebabName}";\n$1`,
      });

      // 6. Update vite.config.ts - insert BEFORE marker
      actions.push({
        type: "modify",
        path: "vite.config.ts",
        pattern: /(        \/\/ PLOP_INJECT_COMPONENT_ENTRY)/,
        template: `        'components/${kebabName}': resolve(__dirname, 'src/components/${kebabName}/index.ts'),\n$1`,
      });

      // 7. Update package.json exports using proper JSON manipulation
      actions.push({
        type: "modify-json",
        path: "package.json",
        transform: (packageJson) => {
          // Create the new export entry
          // Note: With preserveModules: true in vite.config.ts:
          // - JS files are flat: dist/components/[name].js
          // - Type files are nested: dist/src/components/[name]/index.d.ts
          const newExport = {
            types: `./dist/src/components/${kebabName}/index.d.ts`,
            import: `./dist/components/${kebabName}.js`,
          };

          // Get all exports
          const exports = packageJson.exports;

          // Create new exports object with components before utils
          const newExports = {};

          for (const [key, value] of Object.entries(exports)) {
            // Add all entries before utils
            if (key === "./utils") {
              // Insert new component export before utils
              newExports[`./components/${kebabName}`] = newExport;
            }
            newExports[key] = value;
          }

          packageJson.exports = newExports;
          return packageJson;
        },
      });

      // 8. Success message
      actions.push(() => {
        console.log("\n✅ Component scaffolded successfully!");
        console.log(`\n📁 Files created:`);
        console.log(`   - src/components/${kebabName}/${kebabName}.tsx`);
        console.log(`   - src/components/${kebabName}/index.ts`);
        console.log(
          `   - src/components/${kebabName}/${kebabName}.stories.tsx`,
        );
        console.log(`   - src/components/${kebabName}/${kebabName}.test.tsx`);
        console.log(`\n📝 Files updated:`);
        console.log(`   - src/index.ts`);
        console.log(`   - vite.config.ts`);
        console.log(`   - package.json`);
        console.log(`\n🧪 Next steps:`);
        console.log(
          `   1. Implement your component in src/components/${kebabName}/${kebabName}.tsx`,
        );
        console.log(
          `   2. Add stories in src/components/${kebabName}/${kebabName}.stories.tsx`,
        );
        console.log(
          `   3. Write tests in src/components/${kebabName}/${kebabName}.test.tsx`,
        );
        console.log(`   4. Run Storybook: pnpm storybook`);
        console.log(`   5. Run tests: pnpm test`);
        console.log(`   6. Build: pnpm build`);
        console.log(`\n💡 Import examples:`);
        console.log(`   import { ${pascalName} } from "@cloudflare/kumo";`);
        console.log(
          `   import { ${pascalName} } from "@cloudflare/kumo/components/${kebabName}";`,
        );

        return "Component created successfully";
      });

      return actions;
    },
  });

  // Block generator
  plop.setGenerator("block", {
    description: "Create a new block component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: 'Block name (e.g., "Page Header" or "page-header"):',
        validate: (value) => {
          if (!value) return "Block name is required";
          if (value.length < 2)
            return "Block name must be at least 2 characters";
          return true;
        },
      },
    ],
    actions: (data) => {
      const actions = [];
      const kebabName = plop.getHelper("kebabCase")(data.name);
      const pascalName = plop.getHelper("pascalCase")(data.name);

      // 1. Create block file
      actions.push({
        type: "add",
        path: "src/blocks/{{kebabCase name}}/{{kebabCase name}}.tsx",
        templateFile: "plop-templates/block.tsx.hbs",
      });

      // 2. Create index file
      actions.push({
        type: "add",
        path: "src/blocks/{{kebabCase name}}/index.ts",
        templateFile: "plop-templates/index.ts.hbs",
      });

      // 3. Create story file
      actions.push({
        type: "add",
        path: "src/blocks/{{kebabCase name}}/{{kebabCase name}}.stories.tsx",
        templateFile: "plop-templates/block.stories.tsx.hbs",
      });

      // 4. Create test file
      actions.push({
        type: "add",
        path: "src/blocks/{{kebabCase name}}/{{kebabCase name}}.test.tsx",
        templateFile: "plop-templates/component.test.tsx.hbs",
      });

      // 5. Update main index.ts - insert BEFORE marker
      actions.push({
        type: "modify",
        path: "src/index.ts",
        pattern: /(\/\/ PLOP_INJECT_BLOCK_EXPORT)/,
        template: `export { ${pascalName}, type ${pascalName}Props } from "./blocks/${kebabName}";\n$1`,
      });

      // 6. Update vite.config.ts - insert BEFORE marker
      actions.push({
        type: "modify",
        path: "vite.config.ts",
        pattern: /(        \/\/ PLOP_INJECT_BLOCK_ENTRY)/,
        template: `        'blocks/${kebabName}': resolve(__dirname, 'src/blocks/${kebabName}/index.ts'),\n$1`,
      });

      // 7. Update package.json exports using proper JSON manipulation
      actions.push({
        type: "modify-json",
        path: "package.json",
        transform: (packageJson) => {
          // Create the new export entry
          // Note: With preserveModules: true in vite.config.ts:
          // - JS files are flat: dist/blocks/[name].js
          // - Type files are nested: dist/src/blocks/[name]/index.d.ts
          const newExport = {
            types: `./dist/src/blocks/${kebabName}/index.d.ts`,
            import: `./dist/blocks/${kebabName}.js`,
          };

          // Get all exports
          const exports = packageJson.exports;

          // Create new exports object with blocks before utils
          const newExports = {};

          for (const [key, value] of Object.entries(exports)) {
            // Add all entries before utils
            if (key === "./utils") {
              // Insert new block export before utils
              newExports[`./blocks/${kebabName}`] = newExport;
            }
            newExports[key] = value;
          }

          packageJson.exports = newExports;
          return packageJson;
        },
      });

      // 8. Success message
      actions.push(() => {
        console.log("\n✅ Block scaffolded successfully!");
        console.log(`\n📁 Files created:`);
        console.log(`   - src/blocks/${kebabName}/${kebabName}.tsx`);
        console.log(`   - src/blocks/${kebabName}/index.ts`);
        console.log(`   - src/blocks/${kebabName}/${kebabName}.stories.tsx`);
        console.log(`   - src/blocks/${kebabName}/${kebabName}.test.tsx`);
        console.log(`\n📝 Files updated:`);
        console.log(`   - src/index.ts`);
        console.log(`   - vite.config.ts`);
        console.log(`   - package.json`);
        console.log(`\n🧪 Next steps:`);
        console.log(
          `   1. Implement your block in src/blocks/${kebabName}/${kebabName}.tsx`,
        );
        console.log(
          `   2. Add stories in src/blocks/${kebabName}/${kebabName}.stories.tsx`,
        );
        console.log(
          `   3. Write tests in src/blocks/${kebabName}/${kebabName}.test.tsx`,
        );
        console.log(`   4. Run Storybook: pnpm storybook`);
        console.log(`   5. Run tests: pnpm test`);
        console.log(`   6. Build: pnpm build`);
        console.log(`\n💡 Import examples:`);
        console.log(`   import { ${pascalName} } from "@cloudflare/kumo";`);
        console.log(
          `   import { ${pascalName} } from "@cloudflare/kumo/blocks/${kebabName}";`,
        );
        console.log(
          `\n📝 Note: Blocks are higher-level components that compose base components.`,
        );

        return "Block created successfully";
      });

      return actions;
    },
  });

  // Layout generator
  plop.setGenerator("layout", {
    description: "Create a new layout component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: 'Layout name (e.g., "Resource List" or "resource-list"):',
        validate: (value) => {
          if (!value) return "Layout name is required";
          if (value.length < 2)
            return "Layout name must be at least 2 characters";
          return true;
        },
      },
    ],
    actions: (data) => {
      const actions = [];
      const kebabName = plop.getHelper("kebabCase")(data.name);
      const pascalName = plop.getHelper("pascalCase")(data.name);

      // 1. Create layout file
      actions.push({
        type: "add",
        path: "src/layouts/{{kebabCase name}}/{{kebabCase name}}.tsx",
        templateFile: "plop-templates/layout.tsx.hbs",
      });

      // 2. Create index file
      actions.push({
        type: "add",
        path: "src/layouts/{{kebabCase name}}/index.ts",
        templateFile: "plop-templates/index.ts.hbs",
      });

      // 3. Create story file
      actions.push({
        type: "add",
        path: "src/layouts/{{kebabCase name}}/{{kebabCase name}}.stories.tsx",
        templateFile: "plop-templates/layout.stories.tsx.hbs",
      });

      // 4. Create test file
      actions.push({
        type: "add",
        path: "src/layouts/{{kebabCase name}}/{{kebabCase name}}.test.tsx",
        templateFile: "plop-templates/component.test.tsx.hbs",
      });

      // 5. Update main index.ts - insert BEFORE marker
      actions.push({
        type: "modify",
        path: "src/index.ts",
        pattern: /(\/\/ PLOP_INJECT_LAYOUT_EXPORT)/,
        template: `export { ${pascalName}, type ${pascalName}Props } from "./layouts/${kebabName}";\n$1`,
      });

      // 6. Update vite.config.ts - insert BEFORE marker
      actions.push({
        type: "modify",
        path: "vite.config.ts",
        pattern: /(        \/\/ PLOP_INJECT_LAYOUT_ENTRY)/,
        template: `        'layouts/${kebabName}': resolve(__dirname, 'src/layouts/${kebabName}/index.ts'),\n$1`,
      });

      // 7. Update package.json exports using proper JSON manipulation
      actions.push({
        type: "modify-json",
        path: "package.json",
        transform: (packageJson) => {
          // Create the new export entry
          // Note: With preserveModules: true in vite.config.ts:
          // - JS files are flat: dist/layouts/[name].js
          // - Type files are nested: dist/src/layouts/[name]/index.d.ts
          const newExport = {
            types: `./dist/src/layouts/${kebabName}/index.d.ts`,
            import: `./dist/layouts/${kebabName}.js`,
          };

          // Get all exports
          const exports = packageJson.exports;

          // Create new exports object with layouts before utils
          const newExports = {};

          for (const [key, value] of Object.entries(exports)) {
            // Add all entries before utils
            if (key === "./utils") {
              // Insert new layout export before utils
              newExports[`./layouts/${kebabName}`] = newExport;
            }
            newExports[key] = value;
          }

          packageJson.exports = newExports;
          return packageJson;
        },
      });

      // 8. Success message
      actions.push(() => {
        console.log("\n✅ Layout scaffolded successfully!");
        console.log(`\n📁 Files created:`);
        console.log(`   - src/layouts/${kebabName}/${kebabName}.tsx`);
        console.log(`   - src/layouts/${kebabName}/index.ts`);
        console.log(`   - src/layouts/${kebabName}/${kebabName}.stories.tsx`);
        console.log(`   - src/layouts/${kebabName}/${kebabName}.test.tsx`);
        console.log(`\n📝 Files updated:`);
        console.log(`   - src/index.ts`);
        console.log(`   - vite.config.ts`);
        console.log(`   - package.json`);
        console.log(`\n🧪 Next steps:`);
        console.log(
          `   1. Implement your layout in src/layouts/${kebabName}/${kebabName}.tsx`,
        );
        console.log(
          `   2. Add stories in src/layouts/${kebabName}/${kebabName}.stories.tsx`,
        );
        console.log(
          `   3. Write tests in src/layouts/${kebabName}/${kebabName}.test.tsx`,
        );
        console.log(`   4. Run Storybook: pnpm storybook`);
        console.log(`   5. Run tests: pnpm test`);
        console.log(`   6. Build: pnpm build`);
        console.log(`\n💡 Import examples:`);
        console.log(`   import { ${pascalName} } from "@cloudflare/kumo";`);
        console.log(
          `   import { ${pascalName} } from "@cloudflare/kumo/layouts/${kebabName}";`,
        );
        console.log(
          `\n📝 Note: Layouts are page-level components for consistent structure.`,
        );

        return "Layout created successfully";
      });

      return actions;
    },
  });
}
