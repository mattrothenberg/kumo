# Figma Plugin V2 Specification - Data-Driven Generic System

## Overview

V2 transforms the Figma plugin from component-specific generators to a **data-driven, functional architecture** that automatically generates Figma ComponentSets from any Tailwind + component registry codebase.

```
component-registry.json → Generic Renderer → Figma ComponentSets
        ↓                         ↓
  (infer structure)      (smart defaults + hooks)
```

**Key Principles:**
- **Zero config for simple components** - Just works from registry data
- **Composable for complex components** - Builder pattern with render hooks
- **Single source of truth** - Registry + Tailwind classes only (unidirectional)
- **Inference over configuration** - Derive behavior from Tailwind patterns
- **Fail fast** - Clear errors for invalid data

## Architecture

### Core: Higher-Order Generator Function

```typescript
type ComponentConfig = {
  name: string;
  props: ComponentPropsFromRegistry;
  classes: Record<string, string>;
  descriptions?: Record<string, string>;

  // Optional overrides
  layout?: LayoutConfig;
  variantStrategy?: 'full' | 'subset' | 'threshold';
  renderHooks?: RenderHooks;
};

type RenderHooks = {
  // Custom component creation
  createComponent?: (props: VariantProps) => Promise<ComponentNode>;

  // Augment generated component
  augmentComponent?: (component: ComponentNode, props: VariantProps) => Promise<void>;

  // Custom child content
  createChildren?: (props: VariantProps) => Promise<SceneNode[]>;
};

// Main orchestrator
async function generateComponentSet(
  config: ComponentConfig,
  page: PageNode,
  startY: number
): Promise<number> {
  // 1. Analyze props and determine variant combinations
  const variants = analyzeVariants(config);

  // 2. Create all component variants
  const components = await createComponentVariants(config, variants);

  // 3. Apply smart layout
  const layout = applySmartLayout(components, config.layout);

  // 4. Combine into ComponentSet
  const componentSet = figma.combineAsVariants(components, page);

  // 5. Create light/dark sections with labels
  return createSectionsWithLayout(componentSet, layout, page, startY);
}
```

### Component Type Detection

The system automatically detects component types from registry structure:

**Simple Component**
- Has only `props.*` with enum values
- Auto-generates full matrix or subset based on cardinality
- Example: Badge, Text

**Stateful Component**
- Has state-related props (hover, focus, disabled, loading)
- Automatically infers state styles from Tailwind classes
- Example: Button, Checkbox

**Compound Component**
- Has sub-components in structure or naming (*.Secondary, *.Primary)
- Creates nested frame hierarchy
- Example: LayerCard

**Custom Component**
- Registers custom render hooks via builder pattern
- Delegates complex rendering to specialized functions
- Example: DateRangePicker (calendar grid), Dropdown (menu structure)

## Tailwind V4 Inference System

### Automatic Style Parsing

The enhanced `parseTailwindClasses()` extracts all styling and behavior:

```typescript
function parseTailwindClasses(classes: string): ComponentStyles {
  return {
    // Layout
    width, height, padding, gap, borderRadius,

    // Colors (direct mapping)
    fillVariable: 'bg-primary' → 'color-primary',
    textVariable: 'text-surface' → 'text-color-surface',
    strokeVariable: 'ring-border' → 'color-border',

    // State styles (NEW)
    stateStyles: {
      hover: parseStateClasses('hover:bg-primary/70'),
      focus: parseStateClasses('focus-visible:ring-active'),
      pressed: parseStateClasses('data-[state=open]:bg-subtle'),
    },

    // Modifiers (NEW)
    disabled: 'disabled:opacity-50' → { opacity: 0.5 },
    loading: detectLoadingIndicator(classes),

    // Special indicators
    isWhiteText: classes.includes('text-white'),
    hasBorder: classes.includes('ring') || classes.includes('border'),
  };
}

function parseStateClasses(stateClasses: string): StateStyles {
  // Extract hover:, focus:, data-[state=*]: prefixes
  // Return { fillVariable?, strokeVariable?, addRing?, opacity? }
}
```

**Tailwind → Figma Variable Mapping (Direct Rules):**
- `bg-{token}` → `color-{token}`
- `text-{token}` → `text-color-{token}`
- `ring-{token}` / `border-{token}` → `color-{token}`
- `bg-{token}/{opacity}` → `color-{token}/{opacity}` (with opacity applied)

### Cross-Cutting Concerns

Automatically detected from Tailwind patterns:

**Disabled State**
```typescript
// Detects: disabled:opacity-50, disabled:cursor-not-allowed
if (hasDisabledClasses) {
  component.opacity = 0.5;
}
```

**Loading State**
```typescript
// If prop includes loading or has loading-related classes
if (isLoadingVariant) {
  const loader = createLoader(size);
  component.appendChild(loader);
}
```

**Interactive States**
```typescript
// Automatically creates variants for hover, focus, pressed when detected
if (hasInteractiveClasses) {
  generateStateVariants(['default', 'hover', 'focus', 'pressed']);
}
```

## Smart Layout System

### Automatic Axis Assignment

The system determines row/column layout based on **prop characteristics**:

```typescript
function assignLayoutAxes(props: ComponentProps): LayoutAxes {
  const propEntries = Object.entries(props);

  // Heuristic 1: Primary semantic prop → rows
  const primaryProps = ['variant', 'type', 'kind'];
  const rowProp = propEntries.find(([key]) => primaryProps.includes(key));

  // Heuristic 2: State/size props → columns
  const columnProps = ['state', 'size', 'selected', 'checked', 'open'];
  const colProps = propEntries.filter(([key]) => columnProps.includes(key));

  // Heuristic 3: Boolean modifiers → separate rows
  const modifierProps = ['disabled', 'loading', 'error'];
  const modifiers = propEntries.filter(([key]) => modifierProps.includes(key));

  return {
    rows: [rowProp, ...modifiers],
    columns: colProps,
    cardinality: calculateCardinality(propEntries),
  };
}
```

### Layout Overrides

Components can override smart defaults:

```typescript
const config: ComponentConfig = {
  name: 'Button',
  // ...
  layout: {
    // Explicit axis assignment
    rows: ['variant', 'disabled'],
    columns: ['size', 'state'],

    // Custom grouping
    sections: [
      { name: 'Text Buttons', filter: { shape: 'base' } },
      { name: 'Icon Buttons', filter: { shape: ['square', 'circle'] } },
    ],

    // Spacing overrides
    labelColumnWidth: 220,
    componentGap: 16,
    rowGap: 80,
  },
};
```

## Variant Reduction Algorithm

### Threshold-Based Strategy

```typescript
function determineVariantStrategy(cardinality: number): VariantStrategy {
  if (cardinality <= 20) {
    return 'full'; // Generate complete matrix
  } else {
    return 'subset'; // Generate strategic subset
  }
}

function generateStrategicSubset(props: ComponentProps): VariantCombination[] {
  const combinations: VariantCombination[] = [];

  // Strategy 1: Full coverage of primary prop
  const primaryProp = props.variant || props.type;
  for (const value of primaryProp.values) {
    combinations.push({
      [primaryProp.key]: value,
      // all other props at default
    });
  }

  // Strategy 2: Size variations with default variant
  const sizeProp = props.size;
  if (sizeProp) {
    for (const size of sizeProp.values) {
      combinations.push({
        variant: primaryProp.default,
        size: size,
        // other props at default
      });
    }
  }

  // Strategy 3: State variations with default variant
  const stateProp = props.state;
  if (stateProp) {
    for (const state of stateProp.values) {
      combinations.push({
        variant: primaryProp.default,
        state: state,
        // other props at default
      });
    }
  }

  // Strategy 4: Boolean modifiers with defaults
  const modifiers = ['disabled', 'loading', 'error'];
  for (const modifier of modifiers) {
    if (props[modifier]) {
      combinations.push({
        variant: primaryProp.default,
        [modifier]: true,
        // other props at default
      });
    }
  }

  return deduplicate(combinations);
}
```

**Example: Button**
- Full cardinality: 6 variants × 4 sizes × 3 shapes × 4 states × 2 disabled × 2 loading = 576
- Strategic subset: ~50 variants covering all key use cases
  - All 6 variants at base size, base shape, default state
  - All 4 sizes at secondary variant, base shape, default state
  - All 4 states at primary variant, base size, base shape
  - Square and circle shapes at secondary variant, all sizes
  - Disabled and loading states at default values

## Component Builder Pattern

### Custom Render Hooks Registry

For complex components, register custom rendering strategies:

```typescript
// Component builders are registered by name
const componentBuilders = new Map<string, ComponentBuilder>();

type ComponentBuilder = {
  createComponent: (props: VariantProps) => Promise<ComponentNode>;
  createChildren?: (props: VariantProps) => Promise<SceneNode[]>;
  augmentComponent?: (component: ComponentNode, props: VariantProps) => Promise<void>;
};

// Register custom builders
componentBuilders.set('DateRangePicker', {
  createComponent: async (props) => {
    const component = figma.createComponent();
    // Custom calendar layout
    const calendar = await createCalendarGrid(props);
    component.appendChild(calendar);
    return component;
  },
});

// Composable pieces for reusability
componentBuilders.set('CalendarGrid', {
  createChildren: async (props) => {
    // Generate 6 weeks × 7 days grid
    return createDayGrid(props.month, props.year, props.selected);
  },
});

componentBuilders.set('MonthHeader', {
  createComponent: async (props) => {
    // Month name + nav arrows
    return createMonthHeaderFrame(props.month, props.showNav);
  },
});
```

### Builder Composition

Complex components compose smaller builders:

```typescript
// DateRangePicker = CalendarGrid + CalendarGrid + Footer
componentBuilders.set('DateRangePicker', {
  createComponent: async (props) => {
    const component = figma.createComponent();
    component.layoutMode = 'VERTICAL';

    // Compose from smaller builders
    const leftCalendar = await componentBuilders.get('CalendarGrid')!.createComponent({
      ...props,
      month: 'December',
      showLeftNav: true,
    });

    const rightCalendar = await componentBuilders.get('CalendarGrid')!.createComponent({
      ...props,
      month: 'January',
      showRightNav: true,
    });

    const footer = await componentBuilders.get('CalendarFooter')!.createComponent(props);

    component.appendChild(leftCalendar);
    component.appendChild(rightCalendar);
    component.appendChild(footer);

    return component;
  },
});
```

## Compound Component Detection

### Automatic Structure Detection

Detects compound components from naming patterns:

```typescript
function detectCompoundStructure(componentName: string): CompoundInfo | null {
  // Check for sub-component exports in registry
  // Example: LayerCard.Secondary, LayerCard.Primary

  const subComponents = registry.components[componentName].subComponents;
  if (subComponents) {
    return {
      type: 'compound',
      root: componentName,
      children: subComponents.map(sub => ({
        name: sub.name,
        props: sub.props,
      })),
    };
  }

  return null;
}

async function createCompoundComponent(
  config: ComponentConfig,
  compoundInfo: CompoundInfo
): Promise<ComponentNode> {
  const component = figma.createComponent();
  component.layoutMode = 'VERTICAL';

  // Create each child section
  for (const child of compoundInfo.children) {
    const childFrame = figma.createFrame();
    childFrame.name = child.name;

    // Apply styles from child.props.classes
    applyTailwindStyles(childFrame, child.props.classes);

    // Add placeholder content
    const content = await createTextNode(child.name, 16, 400);
    childFrame.appendChild(content);

    component.appendChild(childFrame);
  }

  return component;
}
```

**Example: LayerCard**
```typescript
// Detected structure:
{
  type: 'compound',
  root: 'LayerCard',
  children: [
    { name: 'Secondary', classes: 'bg-transparent text-label' },
    { name: 'Primary', classes: 'bg-layer-card-primary ring-color' }
  ]
}

// Generates:
// LayerCard (Component)
//   ├─ Secondary (Frame) - bg-transparent, text-label
//   └─ Primary (Frame) - bg-layer-card-primary, ring-color
```

## Plugin UI: Generation Strategy Toggle

### Side-by-Side Comparison Mode

The plugin UI includes a toggle button to easily compare V1 (legacy) vs V2 (new system) output:

```typescript
// ui.html
<div class="generation-strategy">
  <h3>Generation Strategy</h3>
  <div class="toggle-group">
    <button id="use-v1" class="strategy-btn active">
      Legacy (V1)
    </button>
    <button id="use-v2" class="strategy-btn">
      New System (V2)
    </button>
  </div>
  <p class="help-text">
    Toggle between legacy generators and new data-driven system.
    V2 is experimental - compare output carefully.
  </p>
</div>

// Plugin logic
figma.ui.onmessage = (msg) => {
  if (msg.type === 'generate') {
    const useV2 = msg.strategy === 'v2';

    if (useV2) {
      generateComponentsV2(componentsPage);
    } else {
      generateComponentsV1(componentsPage); // Existing generators
    }
  }
};
```

### Comparison Workflow

1. **Run V1 (Baseline)**
   - Click "Legacy (V1)" button
   - Generate all components with existing generators
   - Components appear on "Components" page

2. **Run V2 (New System)**
   - Click "New System (V2)" button
   - Generate all components with new system
   - Components appear on separate "Components V2" page

3. **Side-by-Side Comparison**
   - Both pages visible in Figma
   - Visual diff: colors, spacing, layout, variants
   - Validate V2 matches V1 output

4. **Switch Default**
   - When V2 is validated, make it default
   - V1 remains available via toggle for debugging

### UI Updates During Migration

**Phase 1-3: V2 in Development**
```
┌─────────────────────────────┐
│ Generation Strategy         │
│ ● Legacy (V1)  ○ V2 (Beta)  │
│ V2 is experimental          │
└─────────────────────────────┘
```

**Phase 4-5: V2 Ready for Testing**
```
┌─────────────────────────────────┐
│ Generation Strategy             │
│ ● Legacy (V1)  ○ New System(V2) │
│ Compare outputs on separate     │
│ pages: "Components" vs          │
│ "Components V2"                 │
└─────────────────────────────────┘
```

**Phase 6: V2 is Default**
```
┌─────────────────────────────────┐
│ Generation Strategy             │
│ ○ Legacy (V1)  ● New System(V2) │
│ V2 is now default. V1 available │
│ for debugging only.             │
└─────────────────────────────────┘
```

## File Structure

```
packages/kumo/scripts/figma/plugin/
├── code.ts                         # Main entry (strategy toggle)
├── ui.html                         # Plugin UI with toggle button (NEW)
├── manifest.json                   # Figma plugin manifest
├── build.sh                        # Build script
├── core/                           # NEW - Core system
│   ├── generator.ts                # Higher-order generateComponentSet()
│   ├── variant-analyzer.ts         # Variant reduction algorithms
│   ├── layout-engine.ts            # Smart layout system
│   ├── style-inferencer.ts         # Enhanced Tailwind parsing
│   └── compound-detector.ts        # Compound component detection
├── builders/                       # NEW - Custom component builders
│   ├── registry.ts                 # Component builder registry
│   ├── calendar-grid.ts            # CalendarGrid builder (from DateRangePicker)
│   ├── month-header.ts             # MonthHeader builder
│   ├── day-cell.ts                 # DayCell builder
│   ├── dropdown-menu.ts            # Dropdown menu structure builder
│   └── dialog-structure.ts         # Dialog layout builder
├── parsers/
│   └── tailwind-to-figma.ts        # Enhanced with state parsing
└── generators/
    ├── shared.ts                   # Utilities (same as before)
    ├── icon-utils.ts               # Icon system (unchanged)
    └── [legacy]/                   # V1 - Keep during migration
        ├── button.ts
        ├── checkbox.ts
        └── ...
```

## Migration Strategy

### Parallel System with UI Toggle

Both systems coexist with easy switching via plugin UI:

```typescript
// code.ts
async function generateComponents(strategy: 'v1' | 'v2') {
  // Find or create appropriate page
  const pageName = strategy === 'v2' ? 'Components V2' : 'Components';
  const page = figma.root.children.find(p => p.name === pageName) as PageNode
    || createPage(pageName);

  let currentY = 100;

  if (strategy === 'v2') {
    // New system - automatic from registry
    figma.notify('Generating with V2 (new data-driven system)...');

    for (const [name, component] of Object.entries(registry.components)) {
      try {
        currentY = await generateComponentSet({
          name,
          props: component.props,
          classes: extractClassesFromProps(component.props),
          descriptions: extractDescriptionsFromProps(component.props),
        }, page, currentY);
      } catch (error) {
        figma.notify(`❌ V2 failed for ${name}: ${error.message}`, { error: true });
        console.error(`V2 generation error for ${name}:`, error);
      }
    }

    figma.notify('✅ V2 generation complete! Compare with V1 on "Components" page.');
  } else {
    // V1 system - existing generators
    figma.notify('Generating with V1 (legacy generators)...');

    currentY = await generateButtonComponents(page, currentY);
    currentY = await generateCheckboxComponents(page, currentY);
    currentY = await generateBadgeComponents(page, currentY);
    // ... all existing generators

    figma.notify('✅ V1 generation complete!');
  }
}
```

### Comparison Testing Process

**Automated Comparison**
```typescript
// Optional: Generate both and highlight differences
async function compareGenerationStrategies() {
  const v1Page = await generateComponents('v1');
  const v2Page = await generateComponents('v2');

  // Collect metrics
  const comparison = {
    v1: collectPageMetrics(v1Page),
    v2: collectPageMetrics(v2Page),
  };

  // Report differences
  console.log('Component count:', comparison.v1.componentCount, 'vs', comparison.v2.componentCount);
  console.log('Generation time:', comparison.v1.duration, 'vs', comparison.v2.duration);

  // Visual markers for differences
  if (comparison.v1.componentCount !== comparison.v2.componentCount) {
    figma.notify('⚠️ Different component counts! Review both pages.', { timeout: 5000 });
  }
}
```

### Migration Checklist

**Phase 1: Core System + UI Toggle (Week 1-2)**
- [ ] Implement plugin UI with strategy toggle button
- [ ] Implement `core/generator.ts` - higher-order function
- [ ] Implement `core/style-inferencer.ts` - enhanced Tailwind parsing
- [ ] Implement `core/layout-engine.ts` - smart layout system
- [ ] Wire up V2 toggle to call new generator
- [ ] Test with Badge (simplest component)
- [ ] Compare V1 vs V2 output in Figma

**Phase 2: Variant Intelligence (Week 2-3)**
- [ ] Implement `core/variant-analyzer.ts` - threshold-based reduction
- [ ] Test with Checkbox (full matrix) and Button (subset)
- [ ] Validate variant counts match V1 generators
- [ ] Visual comparison in Figma

**Phase 3: Compound Components (Week 3-4)**
- [ ] Implement `core/compound-detector.ts`
- [ ] Test with LayerCard
- [ ] Ensure nested frame hierarchy matches V1
- [ ] Visual comparison in Figma

**Phase 4: Custom Builders (Week 4-6)**
- [ ] Create `builders/registry.ts` framework
- [ ] Extract DateRangePicker logic into composable builders:
  - [ ] `builders/calendar-grid.ts`
  - [ ] `builders/month-header.ts`
  - [ ] `builders/day-cell.ts`
- [ ] Test DateRangePicker with composed builders
- [ ] Visual comparison in Figma

**Phase 5: Full Migration (Week 6-8)**
- [ ] Migrate all 15 components to V2
- [ ] Comparative testing (V1 vs V2 output via toggle)
- [ ] Performance benchmarking
- [ ] Enable V2 as default in UI
- [ ] Update plugin description

**Phase 6: Cleanup (Week 8+)**
- [ ] Remove V1 toggle option from UI
- [ ] Archive legacy generators to `generators/[legacy-archived]/`
- [ ] Update documentation
- [ ] Announce V2 as production system

## Error Handling

### Fail Fast with Context

```typescript
class ComponentGenerationError extends Error {
  constructor(
    public componentName: string,
    public phase: 'parsing' | 'variant-generation' | 'layout' | 'rendering',
    message: string,
    public context?: Record<string, any>
  ) {
    super(`[${componentName}] ${phase}: ${message}`);
  }
}

// Usage
throw new ComponentGenerationError(
  'Button',
  'parsing',
  'Missing classes for variant "primary"',
  { availableVariants: Object.keys(classes) }
);
```

### Validation Checks

```typescript
function validateComponentConfig(config: ComponentConfig): void {
  // 1. Required fields
  if (!config.name || !config.props) {
    throw new ComponentGenerationError(config.name, 'parsing', 'Missing required fields');
  }

  // 2. Props have classes
  for (const [propName, prop] of Object.entries(config.props)) {
    if (prop.type === 'enum' && !prop.classes) {
      throw new ComponentGenerationError(
        config.name,
        'parsing',
        `Enum prop "${propName}" missing classes mapping`
      );
    }
  }

  // 3. Tailwind classes are parseable
  for (const [variant, classes] of Object.entries(config.props.variant?.classes || {})) {
    try {
      parseTailwindClasses(classes);
    } catch (err) {
      throw new ComponentGenerationError(
        config.name,
        'parsing',
        `Invalid Tailwind classes for variant "${variant}": ${classes}`,
        { error: err }
      );
    }
  }

  // 4. Variable references exist in Figma
  const styles = parseTailwindClasses(config.props.variant.classes[config.props.variant.default]);
  if (styles.fillVariable) {
    const variable = getVariableByName(styles.fillVariable);
    if (!variable) {
      console.warn(`[${config.name}] Variable not found: ${styles.fillVariable}`);
      // Warn but don't fail - Figma variables might not be synced yet
    }
  }
}
```

### User-Facing Error Messages

When generation fails, show helpful errors in Figma:

```typescript
try {
  await generateComponentSet(config, page, startY);
} catch (error) {
  if (error instanceof ComponentGenerationError) {
    figma.notify(
      `❌ ${error.componentName} (${error.phase}): ${error.message}`,
      { error: true, timeout: 10000 }
    );

    // Log detailed context for debugging
    console.error('Generation failed:', {
      component: error.componentName,
      phase: error.phase,
      message: error.message,
      context: error.context,
    });
  } else {
    figma.notify(`❌ Unexpected error: ${error.message}`, { error: true });
    throw error;
  }
}
```

## Usage Examples

### Simple Component (Badge)

```typescript
// Fully automatic - just works
await generateComponentSet({
  name: 'Badge',
  props: registry.components.Badge.props,
  classes: registry.components.Badge.props.variant.classes,
  descriptions: registry.components.Badge.props.variant.descriptions,
}, page, startY);

// Generated:
// - 5 variants (primary, secondary, destructive, outline, beta)
// - Auto-layout: single row (cardinality = 5 < 20)
// - Styles inferred from Tailwind classes
// - Light + dark sections
```

### Stateful Component (Button)

```typescript
// Automatic state inference + smart subset
await generateComponentSet({
  name: 'Button',
  props: registry.components.Button.props,
  classes: registry.components.Button.props.variant.classes,
}, page, startY);

// Generated:
// - ~50 strategic variants (not 576)
// - Rows: variant (6 values)
// - Columns: state (4 values), disabled, loading
// - Separate sections: shape=square, shape=circle
// - State styles auto-inferred from hover:, focus:, etc
```

### Compound Component (LayerCard)

```typescript
// Automatic compound detection
await generateComponentSet({
  name: 'LayerCard',
  props: registry.components.LayerCard.props,
  classes: registry.components.LayerCard.props.classes,
}, page, startY);

// Generated:
// - Detects LayerCard.Secondary, LayerCard.Primary from structure
// - Creates nested frames with respective styles
// - Single variant (no props matrix)
```

### Custom Component (DateRangePicker)

```typescript
// Register custom builder first
componentBuilders.set('DateRangePicker', {
  createComponent: async (props) => {
    // Compose from smaller builders
    const component = figma.createComponent();
    const leftCal = await componentBuilders.get('CalendarGrid')!.createComponent({...props, month: 'Dec'});
    const rightCal = await componentBuilders.get('CalendarGrid')!.createComponent({...props, month: 'Jan'});
    component.appendChild(leftCal);
    component.appendChild(rightCal);
    return component;
  },
});

// Then generate
await generateComponentSet({
  name: 'DateRangePicker',
  props: registry.components.DateRangePicker.props,
  renderHooks: componentBuilders.get('DateRangePicker'),
}, page, startY);
```

## Benefits Over V1

| Aspect | V1 (Current) | V2 (Proposed) |
|--------|--------------|---------------|
| **Lines of code** | ~8,000 (15 generators × ~500 lines) | ~2,000 (core system + builders) |
| **Add new component** | Write 300-500 line generator file | Automatic for simple, register builder for complex |
| **Consistency** | Manual - each generator differs | Automatic - single system ensures consistency |
| **Maintainability** | High - change requires touching many files | Low - change core logic once |
| **Tailwind changes** | Update parsers in each generator | Update style-inferencer once |
| **Testing** | Test each generator separately | Test core system + selective builder tests |
| **Comparison** | Manual code review | UI toggle for instant visual comparison |
| **Portability** | Kumo-specific | Generic - works with any Tailwind project |
| **Learning curve** | Low - copy existing pattern | Medium - understand core abstractions |

## Trade-offs and Considerations

### What We Gain
- **Dramatically reduced code** - 75% less code to maintain
- **Automatic for simple components** - Zero config for most components
- **Consistency** - All components use same layout/styling logic
- **Easy comparison** - UI toggle to compare V1 vs V2 instantly
- **Extensibility** - Builder pattern for complex cases
- **Portability** - Works with any Tailwind + registry setup

### What We Trade
- **Explicit control** - Some magic in inference
- **Learning curve** - Developers need to understand abstractions
- **Debugging complexity** - More indirection layers
- **Initial investment** - Significant refactor required

### When to Use Legacy Generators
During transition, use legacy if:
- Time-critical bug fix needed
- V2 doesn't handle edge case yet
- Component requires unique logic not yet supported
- Visual output differs from V1 and V1 is correct

## Open Questions

1. **Performance**: Should we cache parsed Tailwind styles between components?
2. **Registry schema**: Should we formalize a JSON schema for validation?
3. **Figma API limits**: Are there limits on ComponentSet size we should consider?
4. **Icon variants**: How should icon color variants be handled (currently manual)?
5. **Animation states**: Loader is static - should we document animation keyframes in descriptions?
6. **Page management**: Should V2 always generate to separate page, or eventually replace V1 page?

## Success Criteria

V2 is successful when:
- [ ] All 15 components generate correctly via new system
- [ ] Output matches V1 (visual comparison via UI toggle)
- [ ] Adding new component takes < 5 minutes (simple) or < 30 minutes (complex)
- [ ] Codebase reduced by > 60%
- [ ] No performance regression (< 2 minutes for full generation)
- [ ] Team can confidently modify core system
- [ ] UI toggle makes comparison effortless

---

**Next Steps:**
1. Review this spec with team
2. Implement plugin UI with strategy toggle
3. Prototype core generator with Badge component
4. Validate approach with side-by-side comparison
5. Iterative migration per checklist
