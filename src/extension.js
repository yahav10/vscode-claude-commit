const vscode = require('vscode');
const { execSync } = require('child_process');

/** Output channel for tracing — visible via "Claude Commit" in the Output panel */
let log;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  log = vscode.window.createOutputChannel('Claude Commit');
  log.appendLine('Extension activated.');
  context.subscriptions.push(log);

  const cmd = vscode.commands.registerCommand('claude-commit.generate', async (sourceControl) => {
    log.appendLine('\n─── Generate triggered ───');

    let repo;

    if (sourceControl && sourceControl.rootUri) {
      // Triggered from scm/title menu — VS Code passes the SourceControl object
      const gitExt = vscode.extensions.getExtension('vscode.git');
      const git = gitExt?.exports?.getAPI(1);
      repo = git?.repositories?.find(r => r.rootUri.fsPath === sourceControl.rootUri.fsPath);
      log.appendLine('Triggered from scm/title: ' + sourceControl.rootUri.fsPath);
    } else {
      // Triggered via keybinding — find repos with staged files
      const gitExt = vscode.extensions.getExtension('vscode.git');
      const git = gitExt?.exports?.getAPI(1);
      const allRepos = git?.repositories || [];

      const reposWithStaged = allRepos.filter(r => {
        try {
          const staged = execSync('git diff --cached --name-only', { cwd: r.rootUri.fsPath }).toString().trim();
          return staged.length > 0;
        } catch { return false; }
      });

      log.appendLine(`Repos with staged files: ${reposWithStaged.length}`);

      if (reposWithStaged.length === 0) {
        vscode.window.showWarningMessage('Claude Commit: no staged files found in any repo.');
        log.appendLine('WARNING: no staged files in any repo.');
        return;
      } else if (reposWithStaged.length === 1) {
        repo = reposWithStaged[0];
        log.appendLine(`Auto-selected repo: ${repo.rootUri.fsPath}`);
      } else {
        // Multiple repos have staged files — ask the user
        const items = reposWithStaged.map(r => ({
          label: r.rootUri.fsPath.split('/').pop(),
          description: r.rootUri.fsPath,
          repo: r,
        }));
        const picked = await vscode.window.showQuickPick(items, {
          placeHolder: 'Multiple repos have staged files — pick one',
        });
        if (!picked) return;
        repo = picked.repo;
        log.appendLine(`User selected repo: ${repo.rootUri.fsPath}`);
      }
    }

    if (!repo) {
      vscode.window.showErrorMessage('Claude Commit: no Git repository found in the workspace.');
      log.appendLine('ERROR: no Git repository found.');
      return;
    }

    const repoRoot = repo.rootUri.fsPath;
    log.appendLine(`Repo root: ${repoRoot}`);

    // List staged files
    let stagedFiles;
    try {
      stagedFiles = execSync('git diff --cached --name-only', { cwd: repoRoot }).toString().trim();
    } catch {
      vscode.window.showErrorMessage('Claude Commit: failed to list staged files.');
      log.appendLine('ERROR: git diff --cached --name-only failed.');
      return;
    }

    if (!stagedFiles) {
      vscode.window.showWarningMessage('Claude Commit: nothing staged. Stage your changes first.');
      log.appendLine('WARNING: no staged files found.');
      return;
    }

    log.appendLine(`Staged files (${stagedFiles.split('\n').length}):`);
    stagedFiles.split('\n').forEach(f => log.appendLine(`  + ${f}`));

    // Get the full staged diff
    let diff;
    try {
      diff = execSync('git diff --cached', { cwd: repoRoot }).toString().trim();
    } catch {
      vscode.window.showErrorMessage('Claude Commit: failed to read staged diff.');
      log.appendLine('ERROR: git diff --cached failed.');
      return;
    }

    log.appendLine(`Diff size: ${diff.length} chars`);
    log.appendLine('Calling Claude CLI…');

    // Show loading state in the input box
    const previousValue = repo.inputBox.value;
    repo.inputBox.value = '⏳ Generating commit message…';

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Claude Commit',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Generating commit message…' });
        const message = await generateMessage(diff, repoRoot);
        if (message) {
          log.appendLine(`Generated message: "${message}"`);
          repo.inputBox.value = message;
          vscode.window.showInformationMessage('Claude Commit: message ready ✓');
        } else {
          repo.inputBox.value = previousValue;
        }
      }
    );
  });

  context.subscriptions.push(cmd);
}

/**
 * Call the Claude CLI and return the commit message.
 */
async function generateMessage(diff, cwd) {
  const customFormat = vscode.workspace.getConfiguration('claude-commit').get('commitFormat', '').trim();

  const formatInstructions = customFormat
    ? customFormat
    : 'Use the format: <type>(<scope>): <short description>\nTypes: feat, fix, refactor, chore, docs, test, style, perf.';

  const prompt = [
    'Generate a concise commit message for the following git diff.',
    'Reply with ONLY the commit message — no explanation, no markdown, no quotes.',
    formatInstructions,
    '',
    diff,
  ].join('\n');

  try {
    const escaped = prompt.replace(/'/g, `'\\''`);
    log.appendLine(`Running: claude -p '<prompt of ${prompt.length} chars>'`);

    const result = execSync(`claude -p '${escaped}' --model claude-haiku-4-5-20251001`, {
      cwd,
      timeout: 30000,
      maxBuffer: 1024 * 1024,
    })
      .toString()
      .trim();

    log.appendLine(`Claude raw response: "${result}"`);

    // Strip any accidental markdown fences
    return result.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
  } catch (err) {
    const msg = err.stderr?.toString() || err.message || 'unknown error';
    log.appendLine(`ERROR from Claude CLI: ${msg}`);
    vscode.window.showErrorMessage(`Claude Commit: ${msg}`);
    return null;
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
