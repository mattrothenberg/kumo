import { noTailwindDarkVariantRule } from "./no-tailwind-dark-variant.js";
import { noPrimitiveColorsRule } from "./no-primitive-colors.js";

const plugin = {
  meta: {
    name: "kumo",
  },
  rules: {
    "no-tailwind-dark-variant": noTailwindDarkVariantRule,
    "no-primitive-colors": noPrimitiveColorsRule,
  },
};

export default plugin;
