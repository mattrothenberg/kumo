declare module "../../dist/color/storybook-colors.js" {
  export type KumoColor = {
    name: string;
    light: string;
    dark: string;
  };

  export const kumoColors: KumoColor[];
}
