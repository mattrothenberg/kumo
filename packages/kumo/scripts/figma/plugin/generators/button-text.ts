/**
 * Button Text Component Generator
 *
 * Generates 24 text button ComponentSets (6 variants × 4 sizes).
 * Each ComponentSet has 5 state variants (Default, Hover, Active, Disabled, Loading).
 *
 * Structure:
 * - Primary (Button Primary XS, SM, Base, LG)
 * - Secondary (Button Secondary XS, SM, Base, LG)
 * - Ghost (Button Ghost XS, SM, Base, LG)
 * - Destructive (Button Destructive XS, SM, Base, LG)
 * - Secondary-Destructive (Button Secondary-Destructive XS, SM, Base, LG)
 * - Outline (Button Outline XS, SM, Base, LG)
 */

/**
 * Button variant definitions from button.tsx
 */
export const BUTTON_VARIANTS = {
  primary: {
    name: "Primary",
    classes:
      "bg-primary !text-white hover:bg-primary/70 disabled:bg-primary/50",
  },
  secondary: {
    name: "Secondary",
    classes:
      "bg-secondary !text-surface ring not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle disabled:bg-secondary/50 disabled:!text-surface/70 ring-border data-[state=open]:bg-subtle",
  },
  ghost: {
    name: "Ghost",
    classes: "text-surface hover:bg-accent shadow-none bg-inherit",
  },
  destructive: {
    name: "Destructive",
    classes: "bg-error !text-white hover:bg-error/70",
  },
  "secondary-destructive": {
    name: "Secondary-Destructive",
    classes:
      "bg-secondary !text-error ring not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle disabled:bg-secondary/50 disabled:!text-error/70 ring-border data-[state=open]:bg-subtle",
  },
  outline: {
    name: "Outline",
    classes: "bg-surface text-surface ring ring-border",
  },
} as const;

/**
 * Button size definitions from button.tsx
 */
export const BUTTON_SIZES = {
  xs: {
    name: "XS",
    height: 20,
    paddingX: 6,
    gap: 4,
    borderRadius: 2,
    fontSize: 12,
  },
  sm: {
    name: "SM",
    height: 26,
    paddingX: 8,
    gap: 4,
    borderRadius: 6,
    fontSize: 12,
  },
  base: {
    name: "Base",
    height: 36,
    paddingX: 12,
    gap: 6,
    borderRadius: 8,
    fontSize: 16,
  },
  lg: {
    name: "LG",
    height: 40,
    paddingX: 16,
    gap: 8,
    borderRadius: 8,
    fontSize: 16,
  },
} as const;

/**
 * Button state variants
 */
export const BUTTON_STATES = [
  "Default",
  "Hover",
  "Active",
  "Disabled",
  "Loading",
] as const;

/**
 * Result of component generation
 */
export type ButtonTextGenerationResult = {
  /** Section names generated */
  sections: string[];
  /** ComponentSet names generated */
  componentSets: string[];
  /** Total count of ComponentSets */
  totalComponents: number;
};

/**
 * Generate all text button ComponentSets
 *
 * @returns Metadata about generated components
 *
 * @example
 * const result = generateButtonTextComponents();
 * console.log(`Generated ${result.totalComponents} ComponentSets`);
 * console.log(`Sections: ${result.sections.join(", ")}`);
 */
export function generateButtonTextComponents(): ButtonTextGenerationResult {
  const sections: string[] = [];
  const componentSets: string[] = [];

  // Generate ComponentSets for each variant × size combination
  for (const variantKey of Object.keys(BUTTON_VARIANTS)) {
    const variant = BUTTON_VARIANTS[variantKey as keyof typeof BUTTON_VARIANTS];
    sections.push(variant.name);

    for (const sizeKey of Object.keys(BUTTON_SIZES)) {
      const size = BUTTON_SIZES[sizeKey as keyof typeof BUTTON_SIZES];
      const componentSetName = `Button ${variant.name} ${size.name}`;
      componentSets.push(componentSetName);
    }
  }

  return {
    sections,
    componentSets,
    totalComponents: componentSets.length,
  };
}
