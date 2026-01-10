# Ralph Implementation for Figma Generator Test Refactoring

This directory implements the Ralph Wiggum pattern for iterative AI-powered development of Figma generator tests.

## What is Ralph?

Ralph is a pattern for AI-assisted development that combines:

1. **Spec documents** (SPEC.md) - Technical architecture and observations
2. **Product Requirements** (PRD.json) - Structured requirements and success criteria
3. **AI prompts** (ralph-prompt.md) - Detailed instructions for AI agents
4. **Automation** (ralph.sh) - Progress tracking and validation

Learn more: https://www.aihero.dev/getting-started-with-ralph

## Files

- **SPEC.md** - Architecture specification with technical decisions and observations
- **PRD.json** - Structured product requirements document
- **ralph-prompt.md** - Prompt template for AI agents (OpenCode/Claude)
- **ralph.sh** - Bash script for progress tracking and validation
- **README.md** - This file

## Quick Start

### 1. Analyze Current State

```bash
cd packages/kumo/scripts/figma/plugin/plans
./ralph.sh all
```

This analyzes all generators and shows:

- Which have test files
- Which have testable exports
- Which read from registry
- Completion percentage

### 2. Analyze Specific Tier

```bash
# Tier 2 (Medium Usage): dropdown, combobox
./ralph.sh 2

# Tier 3 (Lower Usage): tooltip, collapsible, etc.
./ralph.sh 3

# Tier 4 (Specialized): switch, link-button, etc.
./ralph.sh 4
```

### 3. Run Tests (No Dry Run)

```bash
./ralph.sh all false
```

This runs all tests and shows pass/fail status.

### 4. Start Refactoring with OpenCode

The ralph.sh script will tell you which generator to work on next:

```bash
cd packages/kumo/scripts/figma/plugin/generators
opencode
```

Then in OpenCode, paste the prompt from `ralph-prompt.md`, replacing `[GENERATOR_NAME]` with the actual generator name (e.g., "dropdown").

Reference these files in your OpenCode session:

```
@../plans/SPEC.md
@../plans/PRD.json
@badge.test.ts
@button.test.ts
@input.test.ts
```

## Workflow

### Phase 1: Understand the Problem

1. Read SPEC.md - Understand architecture decisions
2. Read PRD.json - Understand requirements
3. Run `./ralph.sh all` - See current state

### Phase 2: Execute (Per Generator)

1. Run `./ralph.sh [tier]` - Identify next generator
2. Open OpenCode in generators directory
3. Paste ralph-prompt.md content
4. Reference SPEC.md, PRD.json, and example test files
5. Let AI refactor the test file
6. Review and validate changes

### Phase 3: Verify

1. Run tests: `pnpm --filter @cloudflare/kumo test [generator].test.ts`
2. Update snapshots if needed: `pnpm test [generator].test.ts -u`
3. Ensure tests pass: `pnpm test [generator].test.ts --run`
4. Run ralph.sh again to see updated progress

### Phase 4: Iterate

Repeat Phase 2-3 for remaining generators until 100% complete.

## Tiers

Generators are organized by usage and complexity:

**Tier 2 (Medium Usage) - 2 generators:**

- dropdown
- combobox

**Tier 3 (Lower Usage) - 6 generators:**

- tooltip
- collapsible
- date-range-picker
- loader
- meter
- pagination

**Tier 4 (Specialized) - 8 generators:**

- switch
- link-button
- refresh-button
- input-area
- sensitive-input
- surface
- layer-card
- menubar

**Tier 1 (High Usage) - Already Complete:**

- badge, banner, button, checkbox, clipboard-text, code, text, input, select, dialog, tabs, toast

## Test Pattern

All tests follow the **Structural + Snapshot** pattern:

### 1. Registry Validation

```typescript
describe("Registry Validation", () => {
  it("should have all expected variants in registry", () => {
    expect(Array.isArray(variantProp.values)).toBe(true);
  });
});
```

### 2. Structural Validation

```typescript
describe("Structural Validation", () => {
  it("should parse base styles correctly", () => {
    const parsed = getParsedBaseStyles();
    expect(typeof parsed.paddingX).toBe("number");
  });
});
```

### 3. Snapshot Tests

```typescript
describe("Snapshots", () => {
  it("should produce consistent variant config", () => {
    expect(getVariantConfig()).toMatchSnapshot();
  });
});
```

## Key Principles

**DO:**

- ✅ Test structure, not exact values
- ✅ Use snapshots for regression protection
- ✅ Export pure functions from generators
- ✅ Follow badge.test.ts pattern

**DON'T:**

- ❌ Hardcode expected Tailwind classes
- ❌ Test specific pixel values
- ❌ Use exact string matches
- ❌ Test design implementation details

## Success Criteria

- [ ] All 29 generators have test files
- [ ] All tests follow structural + snapshot pattern
- [ ] No exact-value assertions for Tailwind classes
- [ ] All tests pass in CI
- [ ] Test execution time under 5s
- [ ] PLAN.md Phase 6 marked complete

## Troubleshooting

### Test Fails After Refactoring

1. Check if generator exports all required functions
2. Verify registry structure matches expectations
3. Update snapshots: `pnpm test [generator].test.ts -u`
4. Compare with badge.test.ts pattern

### Generator Missing Registry Data

1. Check if component exports KUMO\_\*\_VARIANTS
2. Run `pnpm codegen:registry` to regenerate
3. Verify component-registry.json has expected structure

### Snapshots Too Large

1. Break into multiple tests per variant
2. Use descriptive snapshot names
3. Consider testing key examples vs. all permutations

## References

- **Ralph Pattern**: https://www.aihero.dev/getting-started-with-ralph
- **AI Coding Tips**: https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum
- **PLAN.md**: ../PLAN.md (Phase tracking)
- **Example Tests**: ../generators/badge.test.ts, button.test.ts, input.test.ts

## Contributing

When adding new generators:

1. Follow the generator pattern from badge.ts
2. Export testable pure functions
3. Create test file following ralph-prompt.md
4. Update PLAN.md status
5. Run ralph.sh to verify completion

## Questions?

See SPEC.md for technical details or PRD.json for requirements.
