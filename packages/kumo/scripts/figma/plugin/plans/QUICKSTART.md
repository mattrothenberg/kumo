# Ralph Quick Start Guide

> Get started with test refactoring in 3 minutes

## 1. Check Status (30 seconds)

```bash
cd packages/kumo/scripts/figma/plugin/plans
./ralph.sh all
```

**Output shows:**

- ✓ Generators with tests
- ✗ Generators needing work
- Completion percentage
- Next generator to work on

## 2. Start Refactoring (2 minutes)

```bash
# Go to generators directory
cd ../generators

# Start OpenCode
opencode
```

**In OpenCode, paste:**

```
I'm refactoring Figma generator tests to use a flexible structural + snapshot pattern
instead of brittle exact-value assertions.

Reference files:
@../plans/SPEC.md
@../plans/PRD.json
@badge.test.ts

Refactor the test file for the **[GENERATOR_NAME]** component following the structural +
snapshot pattern used in badge.test.ts.

Follow the requirements in ralph-prompt.md:

1. Add testable exports to the generator (pure functions, no Figma API)
2. Create test file with 3 sections: Registry Validation, Structural Validation, Snapshots
3. Use typeof checks and toBeDefined() - NO exact string matches
4. Capture snapshots for regression protection

The test should verify the functional contract (AST → Parser → Figma data),
not design details.
```

Replace `[GENERATOR_NAME]` with the actual generator (e.g., "dropdown").

## 3. Validate (1 minute)

```bash
# Run the new test
pnpm --filter @cloudflare/kumo test [generator].test.ts

# Update snapshots (first run)
pnpm --filter @cloudflare/kumo test [generator].test.ts -u

# Verify it passes
pnpm --filter @cloudflare/kumo test [generator].test.ts --run

# Check progress
cd ../plans
./ralph.sh all
```

## That's It!

Repeat for each generator until 100% complete.

---

## Cheat Sheet

### Check specific tier

```bash
./ralph.sh 2    # Tier 2 (dropdown, combobox)
./ralph.sh 3    # Tier 3 (tooltip, collapsible, etc.)
./ralph.sh 4    # Tier 4 (switch, link-button, etc.)
```

### Run tests (no dry run)

```bash
./ralph.sh all false
```

### Full prompt details

See `ralph-prompt.md` for comprehensive instructions.

### Pattern examples

- Simple: `badge.test.ts`
- Complex: `button.test.ts`
- With states: `input.test.ts`

### Principles

✅ Test structure, not values  
✅ Use snapshots for regression  
✅ Export pure functions  
❌ No exact string matches  
❌ No hardcoded pixels  
❌ No design details

---

**Questions?** See README.md or SPEC.md
