declare module "../../dist/color/storybook-colors.js" {
  /**
   * Token type distinguishes between:
   * - "semantic": Base semantic tokens (e.g., --color-surface)
   * - "global": Theme-specific global tokens (e.g., --color-fedramp-surface)
   * - "override": Semantic overrides via data-theme
   */
  export type TokenType = "semantic" | "global" | "override";

  export type KumoColor = {
    name: string;
    light: string;
    dark: string;
    theme: string;
    tokenType: TokenType;
  };

  export const kumoColors: KumoColor[];
}
