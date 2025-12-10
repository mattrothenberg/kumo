import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

/**
 * ESLint config for jsx-a11y rules NOT yet implemented in oxlint.
 * oxlint handles the majority of linting (fast, Rust-based).
 * ESLint only runs these 7 missing jsx-a11y rules.
 *
 * @see https://github.com/oxc-project/oxc/issues/1141
 */
export default [
  // jsx-a11y rules only
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // ============================================
      // 7 MISSING jsx-a11y rules (6 recommended + 1 not recommended)
      // These are not yet implemented in oxlint
      // https://github.com/oxc-project/oxc/issues/1141
      // ============================================

      // Validates ARIA state and property values
      "jsx-a11y/aria-proptypes": "warn",

      // Interactive elements must be focusable
      "jsx-a11y/interactive-supports-focus": "warn",

      // Don't assign non-interactive roles to interactive elements
      "jsx-a11y/no-interactive-element-to-noninteractive-role": "warn",

      // Non-interactive elements should not have event handlers
      "jsx-a11y/no-noninteractive-element-interactions": "warn",

      // Don't assign interactive roles to non-interactive elements
      "jsx-a11y/no-noninteractive-element-to-interactive-role": "warn",

      // Static elements (div, span) should not have event handlers
      "jsx-a11y/no-static-element-interactions": "warn",

      // Note: control-has-associated-label is not in jsx-a11y's recommended set
      // but is valuable for ensuring controls have label associations
      "jsx-a11y/control-has-associated-label": "warn",
    },
  },

  // Ignore patterns
  {
    ignores: ["dist/**", "node_modules/**", "*.config.*"],
  },
];
