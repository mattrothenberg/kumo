# Zero Data Retention: Deep Dive

## What is Zero Data Retention (ZDR)?

Zero Data Retention is a security policy where:

- **No data is stored** on the server after a session ends
- **All resources are immediately deleted** when you close a session
- **Compliance requirement** for sensitive environments

This is great for security, but breaks caching assumptions in tools like OpenCode.

## The Resource ID Problem

### How OpenCode Normally Works

1. You attach a file: `opencode run -f PRD.json`
2. OpenCode uploads it and gets: `rs_abc123...`
3. OpenCode stores this ID in local cache
4. Next run: OpenCode says "I already have `rs_abc123`!"
5. Server: "Here's the content"

### What Breaks in ZDR

1. You attach a file: `opencode run -f PRD.json`
2. OpenCode uploads it and gets: `rs_abc123...`
3. OpenCode stores this ID in local cache
4. **Session ends → Server deletes `rs_abc123`**
5. Next run: OpenCode says "I already have `rs_abc123`!"
6. Server: **"Error: That doesn't exist anymore"** ❌

## Where Resource IDs Hide

OpenCode stores resource IDs in multiple places:

### 1. Messages (`~/.local/share/opencode/storage/message/`)

```json
{
  "content": [
    {
      "type": "resource",
      "resource": {
        "id": "rs_abc123...", // ← Deleted by ZDR
        "name": "PRD.json"
      }
    }
  ]
}
```

### 2. Parts (`~/.local/share/opencode/storage/part/`)

```json
{
  "type": "tool_use",
  "input": {
    "filePath": "/path/to/file",
    "resourceId": "rs_def456..." // ← Deleted by ZDR
  }
}
```

### 3. Todos (`~/.local/share/opencode/storage/todo/`)

```json
[
  {
    "content": "Review @PRD.json",
    "metadata": {
      "fileRef": "rs_ghi789..." // ← Deleted by ZDR
    }
  }
]
```

### 4. Session Diffs (`~/.local/share/opencode/storage/session_diff/`)

Tracks changes between sessions, often references resources.

## Why Ralph Needs Aggressive Cleaning

Ralph runs **multiple iterations** in a loop:

```bash
Iteration 1: opencode run -f PRD.json  # Creates rs_abc123
  → Session ends → ZDR deletes rs_abc123

Iteration 2: opencode run -f PRD.json  # Tries to use cached rs_abc123
  → ERROR: rs_abc123 not found! ❌
```

Without cleaning, **every iteration after the first fails**.

## The Solution: Nuclear Cleanup

`ralph.sh` now does this before running:

```bash
# Remove ALL cached state
rm -rf ~/.local/share/opencode/storage/todo
rm -rf ~/.local/share/opencode/storage/message
rm -rf ~/.local/share/opencode/storage/part
rm -rf ~/.local/share/opencode/storage/session_diff

# Recreate empty directories
mkdir -p ~/.local/share/opencode/storage/{todo,message,part,session_diff}
```

This forces OpenCode to:

1. Upload files fresh each time (no cache)
2. Create new resource IDs each time
3. Not reference any deleted resources

## What You Lose

- **Session history** - Can't browse past Ralph runs in OpenCode UI
- **Cached files** - Files are re-uploaded each iteration (slightly slower)
- **Persistent todos** - Todos don't carry over between Ralph runs

## What You Keep

- **Project config** - `.opencode/` settings stay
- **Auth tokens** - No need to re-login
- **User preferences** - Theme, editor settings, etc.

## Alternative Solutions (Why They Don't Work)

### ❌ "Just don't cache"

OpenCode doesn't have a `--no-cache` flag. Caching is built-in.

### ❌ "Clean only todos"

Resource IDs are in messages and parts too. Cleaning just todos isn't enough.

### ❌ "Use --continue"

This makes it worse! Continues the session with even more stale references.

### ❌ "Run from different directory"

OpenCode tracks project by git root hash. Same project = same cache.

### ✅ "Nuclear cleanup before each run"

Only reliable solution. Start fresh every time.

## Performance Impact

**Cleaning:** ~50ms (very fast, just deleting files)

**Re-uploading files:** Depends on file size

- Small files (< 1MB): Negligible
- Large files (> 10MB): May add 1-2 seconds per iteration

**For Ralph:** Not a problem. Iterations take 10-30 seconds anyway.

## When You Don't Need This

If you're **NOT** in a Zero Data Retention org, you don't need aggressive cleanup:

- Resource IDs persist indefinitely
- Caching works as intended
- Use the standard `opencode run` workflow

## Detecting ZDR Mode

You'll know you're in a ZDR org if you see:

```
Error: Item with id 'rs_...' not found. Items are not persisted for
Zero Data Retention organizations.
```

If you see this, use `ralph.sh` (which auto-cleans) or switch to a non-ZDR org.

## Future Improvements

Ideally, OpenCode would:

1. Detect ZDR mode automatically
2. Disable caching in ZDR environments
3. Always upload fresh in ZDR mode

Until then, manual cleanup is required.
