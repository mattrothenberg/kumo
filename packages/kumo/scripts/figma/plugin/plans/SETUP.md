# Ralph Setup Guide

## Prerequisites

1. **OpenCode CLI installed** (v1.1.12+)

   ```bash
   opencode --version
   ```

2. **OpenAI API key configured**

   ```bash
   opencode auth
   ```

3. **Set default model to GPT-5.2**

   Edit `~/.config/opencode/opencode.jsonc`:

   ```json
   {
     "$schema": "https://opencode.ai/schema/config.json",
     "model": "openai/gpt-5.2"
   }
   ```

## Running Ralph

```bash
cd packages/kumo/scripts/figma/plugin/plans
./ralph.sh 5   # Run up to 5 iterations
```

## What Ralph Does

Each iteration:

1. Reads the next incomplete generator from `PRD.json`
2. Adds testable exports to the generator
3. Creates/refactors the test file using structural + snapshot pattern
4. Runs tests and updates snapshots
5. Updates `PRD.json` to mark completion
6. Logs progress to `progress.txt`
7. Makes a git commit

## Monitoring Progress

```bash
# Watch progress file
tail -f progress.txt

# Watch git commits
watch -n 5 'git log --oneline -5'
```

## Model Priority

OpenCode loads models in this order:

1. `--model` flag (we use this in ralph.sh)
2. `model` in config file (we set this as backup)
3. Last used model
4. Internal default

Both #1 and #2 are configured to use `openai/gpt-5.2`.
