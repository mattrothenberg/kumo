declare module "../../scripts/color/dist/storybook-colors.js" {
  export type KumoColor = {
    name: string;
    light: string;
    dark: string;
  };

  export const kumoColors: KumoColor[];
}
