# Claude Commit

Automatically generate conventional commit messages from your staged changes using Claude AI. Supports VS Code via an extension and any editor via a Claude skill.

## Prerequisites

- [Claude CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated

---

## Option 1 — VS Code Extension

Adds a `Cmd+Shift+G` shortcut and a button in the Source Control panel's `...` menu.

### Install

```bash
bash install.sh
```

Then reload VS Code: `Cmd+Shift+P` → **Developer: Reload Window**

### Usage

- Press **`Cmd+Shift+G`** anywhere in VS Code, or
- Open the **`...`** menu next to any repo in the Source Control panel → *Generate Commit Message (Claude)*

If you have multiple repos open with staged files, it will ask which one to use.

### Custom format

Open VS Code Settings (`Cmd+,`), search `claude-commit`, and fill in your preferred format. Or add a `.vscode/settings.json` to your repo to share the format with your team:

```json
{
  "claude-commit.commitFormat": "Always prefix with the Jira ticket from the branch name. Format: TICKET-123: short description."
}
```

If no format is set, it defaults to [Conventional Commits](https://www.conventionalcommits.org/).

---

## Option 2 — Claude Skill

Works with any editor. Just ask Claude to generate a commit message and it reads your staged diff directly.

### Install (personal)

Double-click `commit-message-skill.skill` to install it in Claude.

### Install (shared with your team)

The skill is already bundled in `.claude/skills/commit-message/`. When anyone mounts this repo in Claude, the skill is automatically available — no manual install needed.

### Usage

Just say: *"generate a commit message"* and Claude will handle the rest.

---

## How it works

Both options read `git diff --cached` from your repo, send the diff to **Claude Haiku** (fast and cost-efficient), and return a single commit message. The VS Code extension populates it directly into the commit input box; the Claude skill displays it for you to copy.

---

## License

MIT
