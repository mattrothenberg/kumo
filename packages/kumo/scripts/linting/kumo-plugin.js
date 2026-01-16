import { noTailwindDarkVariantRule } from "./no-tailwind-dark-variant.js";
import { noPrimitiveColorsRule } from "./no-primitive-colors.js";
import { enforceVariantStandardRule } from "./enforce-variant-standard.js";

const plugin = {
  meta: {
    name: "kumo",
  },
  rules: {
    "no-tailwind-dark-variant": noTailwindDarkVariantRule,
    "no-primitive-colors": noPrimitiveColorsRule,
    "enforce-variant-standard": enforceVariantStandardRule,
  },
};

export default plugin;
