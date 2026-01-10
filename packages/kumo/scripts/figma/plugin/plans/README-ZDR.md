# Zero Data Retention (ZDR) Compatibility

## The Problem

In Zero Data Retention organizations, OpenCode resource IDs (like `rs_...`) are **immediately deleted** after sessions end. However, OpenCode caches these IDs in:

- **Todos** - Task lists that reference file/message IDs
- **Messages** - Stored message content with resource references
- **Parts** - Message components that reference resources
- **Session diffs** - Changes tracked between sessions

When you run `opencode run` again, it tries to load these cached references, causing:

```
Error: Item with id 'rs_...' not found. Items are not persisted for Zero Data Retention organizations.
```

## The Solution

`ralph.sh` now **automatically clears all OpenCode storage** before running. This ensures no stale resource references exist.

### What Gets Cleaned

| Directory       | Purpose         | Why Clean It                                  |
| --------------- | --------------- | --------------------------------------------- |
| `todo/`         | Task lists      | Contains resource IDs from previous tasks     |
| `message/`      | Cached messages | Contains resource references in content       |
| `part/`         | Message parts   | Contains resource IDs for file attachments    |
| `session_diff/` | Session changes | Contains diff references to deleted resources |

### What's Preserved

- **Project metadata** - Your project configuration stays
- **Auth tokens** - No need to re-authenticate
- **Config** - Your OpenCode settings are unchanged

## Usage

Just run Ralph normally:

```bash
./ralph.sh 5
```

You'll see:

```
Cleaning OpenCode state for Zero Data Retention compatibility...
✓ Cleaned storage

===============================
Ralph iteration 1 of 5
===============================
```

## Trade-offs

**What you lose:**

- Session history (can't view past Ralph sessions)
- Todos from previous runs
- Message caches (slightly slower first load)

**What you gain:**

- Ralph works reliably in ZDR orgs
- No manual cleanup required
- Fresh state for each run

## Alternative: Manual Cleanup

If you want to clean storage without running Ralph:

```bash
./ralph-clean.sh
```

Or manually:

```bash
rm -rf ~/.local/share/opencode/storage/{todo,message,part,session_diff}
mkdir -p ~/.local/share/opencode/storage/{todo,message,part,session_diff}
```

## Why This Happens

1. **Normal flow:** OpenCode creates resource IDs for files, messages, and todos
2. **ZDR policy:** These resources are deleted immediately when the session ends
3. **Cache mismatch:** Next run tries to load cached state with deleted IDs
4. **Error:** OpenCode can't find the resources and fails

The cleanup breaks this cycle by removing all cached state before each run.

## Technical Details

Resource IDs (`rs_...`) are server-side references that OpenCode creates for:

- File attachments (`-f` flags in `opencode run`)
- Message content with embedded resources
- Todo items that reference files or messages
- Session state and diffs

In non-ZDR orgs, these persist indefinitely. In ZDR orgs, they're deleted when the session ends, but the **local cache doesn't know this** and tries to reference them anyway.

The solution is to clear the cache so OpenCode starts fresh each time, re-creating any needed resources from the actual files on disk.
