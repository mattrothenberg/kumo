# Troubleshooting Ralph

## Zero Data Retention Error

**Symptom:**

```
Error: Item with id 'rs_...' not found. Items are not persisted for Zero Data Retention organizations.
```

**Solution:**

```bash
./ralph.sh 5  # Ralph automatically cleans ALL storage on startup
```

**Root Cause:** OpenCode caches resource IDs (`rs_...`) in messages, parts, todos, and session diffs. In Zero Data Retention organizations, those resources are deleted immediately after sessions end, but the local cache still references them.

**What Gets Cleaned:** `ralph.sh` removes all cached state (todos, messages, parts, session_diffs) before running to ensure no stale references exist.

**Trade-off:** You lose session history, but Ralph works reliably in ZDR orgs.

---

## Other Common Issues

### Ralph exits immediately

**Check:** Does `ralph-prompt.md` output `<promise>COMPLETE</promise>`?

- If yes: All generators are complete (check PRD.json)
- If no: Check opencode is installed and in PATH

### Tests failing during iteration

**Check:** Are snapshot tests failing?

- Run: `pnpm --filter @cloudflare/kumo test [generator].test.ts -u`
- This updates snapshots to current implementation

### Wrong model being used

**Check:** Is GPT-5.2 available?

- Ralph hardcodes `--model openai/gpt-5.2`
- Update `ralph.sh` if you need a different model

---

## Debug Commands

```bash
# Check OpenCode version
opencode --version

# List available models
opencode models

# Check OpenCode paths
opencode debug paths

# List todos (should be empty after cleaning)
ls -la ~/.local/share/opencode/storage/todo/

# Check PRD status
cat PRD.json | jq '.generators[] | select(.passes == false) | .name'
```
