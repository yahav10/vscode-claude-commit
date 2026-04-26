---
name: commit-message
description: >
  Generate a git commit message from staged changes. Use this skill whenever
  the user asks to: generate a commit message, write a commit message, create
  a commit message from staged files, suggest a commit message, or says things
  like "what should my commit message be", "help me commit", or "generate commit".
  Works with any IDE or editor — VS Code, IntelliJ, terminal, anything.
  Always use this skill even if the user doesn't explicitly say "skill" or "commit message",
  as long as they have staged git changes and want help committing.
---

# Commit Message Generator

Generate a concise, conventional commit message from the user's staged git changes.

## Step 1 — Get access to the repo

If the user hasn't already selected a folder (i.e. no mounted workspace folder is visible), use the `request_cowork_directory` tool to ask them to select their repo folder. Tell them: "Please select the root of the repo you want to commit from."

Once you have access, note the mounted path.

## Step 2 — Get staged changes

Run these two commands using Bash (substituting the actual mounted path):

```bash
git -C <repo-path> diff --cached --name-only
git -C <repo-path> diff --cached
```

If `diff --cached --name-only` returns nothing, tell the user:
> "No staged files found. Stage your changes first with `git add` and try again."

Then stop.

## Step 3 — Generate the message

Read the `claude-commit.commitFormat` setting if a `.vscode/settings.json` exists in the repo. If found and non-empty, use those instructions as the format. Otherwise use conventional commits.

**Default format:**
```
<type>(<scope>): <short description>
Types: feat, fix, refactor, chore, docs, test, style, perf
```

Build a prompt:
```
Generate a concise commit message for the following git diff.
Reply with ONLY the commit message — no explanation, no markdown, no quotes.
<format instructions>

<diff>
```

Use your own language model capability to generate the message — no CLI call needed since you're already Claude.

## Step 4 — Present the result

Show the commit message clearly:

```
✅ Suggested commit message:

chore(build): add TypeScript incremental build info file
```

Then offer these options:
- **Copy** — just display it prominently so they can copy it
- **Apply** — if they're using VS Code and want you to write it directly to the SCM input box (requires the Claude Commit VS Code extension to be installed — if not, offer to install it via the `install-claude-commit.sh` script)
- **Regenerate** — if they don't like it, ask for guidance (e.g. "make it shorter", "add ticket number") and generate again

## Tips

- Keep messages under 72 characters
- If the diff is very large (>100KB), summarize by file rather than reading every line
- If multiple logical changes are staged, mention this to the user — it might be worth splitting into separate commits
- If a `.vscode/settings.json` has a `claude-commit.commitFormat` setting, always respect it
