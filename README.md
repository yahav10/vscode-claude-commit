<div align="center">

# ✍️ Claude Commit

**Automatically generate conventional commit messages from your staged changes using Claude AI.**

Supports VS Code via an extension and any editor via a Claude skill.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://code.visualstudio.com)
[![Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20Haiku-purple)](https://claude.ai)
[![Conventional Commits](https://img.shields.io/badge/Commits-Conventional-orange)](https://www.conventionalcommits.org)

</div>

---

## ⚡ Quick Start

**VS Code Extension** — install and get a keybind + Source Control menu button:

```bash
bash install.sh
```

Then reload VS Code: `Cmd+Shift+P` → **Developer: Reload Window**

**Claude Skill** — works with any editor, no install needed if the repo is already mounted:

Just say: *"generate a commit message"* and Claude handles the rest.

---

## ✨ Options

| Option | What it does |
|--------|-------------|
| 🖥️ **VS Code Extension** | Adds `Cmd+Shift+G` and a button in the Source Control `...` menu |
| 🤖 **Claude Skill** | Works in any editor — Claude reads your staged diff directly |

---

## 🖥️ VS Code Extension

### Install

```bash
bash install.sh
```

### Usage

- Press **`Cmd+Shift+G`** anywhere in VS Code, or
- Open the **`...`** menu next to any repo in the Source Control panel → *Generate Commit Message (Claude)*

If you have multiple repos open with staged files, it will ask which one to use.

### Custom Format

Open VS Code Settings (`Cmd+,`), search `claude-commit`, and fill in your preferred format. Or add a `.vscode/settings.json` to your repo to share the format with your team:

```json
{
  "claude-commit.commitFormat": "Always prefix with the Jira ticket from the branch name. Format: TICKET-123: short description."
}
```

If no format is set, it defaults to [Conventional Commits](https://www.conventionalcommits.org/).

---

## 🤖 Claude Skill

Works with any editor. Just ask Claude to generate a commit message and it reads your staged diff directly.

### Install (personal)

Double-click `commit-message-skill.skill` to install it in Claude.

### Install (shared with your team)

The skill is already bundled in `.claude/skills/commit-message/`. When anyone mounts this repo in Claude, the skill is automatically available — no manual install needed.

---

## 🔧 Prerequisites

- [Claude CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated

---

## ⚙️ How It Works

Both options read `git diff --cached` from your repo, send the diff to **Claude Haiku** (fast and cost-efficient), and return a single commit message.

| Step | VS Code Extension | Claude Skill |
|------|------------------|--------------|
| 1 | Triggered by keybind or menu | Triggered by your message |
| 2 | Reads `git diff --cached` | Reads `git diff --cached` |
| 3 | Sends diff to Claude Haiku | Sends diff to Claude Haiku |
| 4 | Populates the commit input box | Displays the message to copy |

---

## ❓ FAQ

<details>
<summary><strong>Does this work with monorepos?</strong></summary>

Yes. If you have multiple repos open in VS Code with staged files, Claude Commit will prompt you to select which repo to use.
</details>

<details>
<summary><strong>Can I customize the commit message format?</strong></summary>

Yes — set `claude-commit.commitFormat` in VS Code Settings or `.vscode/settings.json`. Great for enforcing Jira ticket prefixes, team-specific conventions, etc.
</details>

<details>
<summary><strong>What model does it use?</strong></summary>

Claude Haiku — chosen for its speed and low cost. Commit messages are short, structured tasks it handles very well.
</details>

<details>
<summary><strong>Does it cost money?</strong></summary>

Yes — it uses the Anthropic API via the Claude CLI. Costs are minimal since Claude Haiku is the most affordable model and each commit diff is a small prompt.
</details>

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

**Built with ❤️ for the Claude Code community**

*Commit smarter, not harder.*

</div>
