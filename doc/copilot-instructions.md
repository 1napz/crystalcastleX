# Best practices for GitHub Copilot CLI

Learn how to get the most out of GitHub Copilot CLI.

## Introduction

GitHub Copilot CLI is a terminal-native AI coding assistant that brings agentic capabilities directly to your command line. Copilot CLI can operate like a chatbot, answering your questions, but its true power lies in its ability to work autonomously as your coding partner, allowing you to delegate tasks and oversee its work.

This article provides tips for getting the most out of Copilot CLI, from using the various CLI commands effectively to managing the CLI's access to files. Consider these tips as starting points, then experiment to find out what works best for your workflows.

> \[!NOTE]
> GitHub Copilot CLI is continually evolving. Use the `/help` command to see the most up to date information.

## 1. Customize your environment

### Use custom instructions files

Copilot CLI automatically reads instructions from multiple locations, allowing you to define organization-wide standards and repository-specific conventions.

**Supported locations (in order of discovery):**

| Location                                    | Scope                 |
| ------------------------------------------- | --------------------- |
| `~/.copilot/copilot-instructions.md`        | All sessions (global) |
| `.github/copilot-instructions.md`           | Repository            |
| `.github/instructions/**/*.instructions.md` | Repository (modular)  |
| `AGENTS.md` (in Git root or cwd)            | Repository            |
| `Copilot.md`, `GEMINI.md`, `CODEX.md`       | Repository            |

#### Best practice

Repository instructions **always take precedence** over global instructions. Use this to enforce team conventions. For example, this is a simple `.github/copilot-instructions.md` file.

```markdown
## Build Commands
- `npm run build` - Build the project
- `npm run test` - Run all tests
- `npm run lint:fix` - Fix linting issues

## Code Style
- Use TypeScript strict mode
- Prefer functional components over class components
- Always add JSDoc comments for public APIs

## Workflow
- Run `npm run lint:fix && npm test` after making changes
- Commit messages follow conventional commits format
- Create feature branches from `main`
```

> \[!TIP]
> Keep instructions concise and actionable. Lengthy instructions can dilute effectiveness.

For more information, see [About customizing GitHub Copilot responses](/en/copilot/concepts/prompting/response-customization?tool=webui).

### Configure allowed tools

Manage which tools Copilot can run without asking for permission. When Copilot requests permission for an action, you can typically choose either to allow it just this time, or allow the tool to be used for the rest of the CLI session.

To reset previously approved tools, use:

```copilot
/reset-allowed-tools
```

You can also preconfigure allowed tools via CLI flags:

```bash
copilot --allow-tool='shell(git:*)' --deny-tool='shell(git push)'
```

**Common permission patterns:**

* `shell(git:*)` — Allow all Git commands
* `shell(npm run:*)` — Allow all npm scripts
* `shell(npm run test:*)` — Allow npm test commands
* `write` — Allow file writes

### Select your preferred model

Use `/model` to choose from available models based on your task complexity:

| Model                         | Best For                                                       | Tradeoffs                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Auto**                      | Reduced rate limiting and lower latency and errors             | See [About Copilot auto model selection](/en/copilot/concepts/auto-model-selection#auto-model-selection-in-github-copilot-cli) |
| **Claude Opus 4.5** (default) | Complex architecture, difficult debugging, nuanced refactoring | Most capable but uses more [premium requests](/en/copilot/concepts/billing/copilot-requests#model-multipliers)                 |
| **Claude Sonnet 4.5**         | Day-to-day coding, most routine tasks                          | Fast, cost-effective, handles most work well                                                                                   |
| **GPT-5.2 Codex**             | Code generation, code review, straightforward implementations  | Excellent for reviewing code produced by other models                                                                          |

**Recommendations:**

* **Auto** intelligently chooses models based on real time system health and model performance, reducing rate limiting and providing lower latency and errors.
* **Opus 4.5** is ideal for tasks requiring deep reasoning, complex system design, subtle bug investigation, or extensive context understanding.
* **Switch to Sonnet 4.5** for routine tasks where speed and cost efficiency matter—it handles the majority of everyday coding effectively.
* **Use Codex** for high-volume code generation and as a second opinion for reviewing code produced by other models.

You can switch models mid-session with `/model` as task complexity changes.

If your organization or enterprise has configured custom models using their own LLM provider API keys, those models also appear in `/model` at the bottom of the list.

### Use your own model provider

You can configure Copilot CLI to use your own model provider instead of GitHub-hosted models. Run `copilot help providers` for full setup instructions.

**Key considerations:**

* Your model must support **tool calling** (function calling) and **streaming**. Copilot CLI returns an error if either capability is missing.
* For best results, use a model with a context window of at least 128k tokens.
* Built-in sub-agents (`/review`, `/task`, explore, `/fleet`) automatically inherit your provider configuration.
* Premium request cost estimates are hidden when using your own provider. Token usage (input, output, and cache counts) is still displayed.
* `/delegate` only works if you are also signed in to GitHub. It transfers the session to GitHub's server-side Copilot, not your provider.

See [Using your own model provider](/en/copilot/concepts/agents/copilot-cli/about-copilot-cli#using-your-own-model-provider).

## 2. Plan before you code

### Plan mode

**Models achieve higher success rates when given a concrete plan to follow.** In plan mode, Copilot will create a structured implementation plan before any code is written.

Press <kbd>Shift</kbd>+<kbd>Tab</kbd> to toggle between normal mode and plan mode. In plan mode, all prompts you enter will trigger the plan workflow.

Alternatively, you can use  the `/plan` command in normal mode to achieve the same effect.

**Example prompt (from normal mode):**

```copilot
/plan Add OAuth2 authentication with Google and GitHub providers
```

**What happens:**

* Copilot analyzes your request and codebase.
* **Asks clarifying questions** to align on requirements and approach.
* Creates a structured implementation plan with checkboxes.
* Saves the plan to `plan.md` in your session folder.
* **Waits for your approval** before implementing.

You can press <kbd>Ctrl</kbd>+<kbd>y</kbd> to view and edit the plan in your default editor for Markdown files.

**Example plan output:**

```markdown
# Implementation Plan: OAuth2 Authentication

## Overview
Add social authentication using OAuth2 with Google and GitHub providers.

## Tasks
- [ ] Install dependencies (passport, passport-google-oauth20, passport-github2)
- [ ] Create authentication routes in `/api/auth`
- [ ] Implement passport strategies for each provider
- [ ] Add session management middleware
- [ ] Create login/logout UI components
- [ ] Add environment variables for OAuth credentials
- [ ] Write integration tests

## Detailed Steps
1. **Dependencies**: Add to package.json...
2. **Routes**: Create `/api/auth/google` and `/api/auth/github`...
```

### When to use plan mode

| Scenario                           | Use plan mode?                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Complex multi-file changes         | <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-check" aria-label="Yes" role="img"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>                                                                                                       |
| Refactoring with many touch points | <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-check" aria-label="Yes" role="img"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>                                                                                                       |
| New feature implementation         | <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-check" aria-label="Yes" role="img"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>                                                                                                       |
| Quick bug fixes                    | <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-x" aria-label="No" role="img"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg> |
| Single file changes                | <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-x" aria-label="No" role="img"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg> |

### The explore → plan → code → commit workflow

For best results on complex tasks:

* **Explore**:

  `Read the authentication files but don't write code yet`

* **Plan**:

  `/plan Implement password reset flow`

* **Review**:

  Check the plan, suggest modifications

* **Implement**:

  `Proceed with the plan`

* **Verify**:

  `Run the tests and fix any failures`

* **Commit**:

  `Commit these changes with a descriptive message`

## 3. Leverage infinite sessions

### Automatic context window management

Copilot CLI features **infinite sessions**. You don't need to worry about running out of context. The system automatically manages context through intelligent compaction that summarizes conversation history while preserving essential information.

**Session storage location:**

```text
~/.copilot/session-state/{session-id}/
├── events.jsonl      # Full session history
├── workspace.yaml    # Metadata
├── plan.md           # Implementation plan (if created)
├── checkpoints/      # Compaction history
└── files/            # Persistent artifacts
```

> \[!NOTE]
> If you ever need to manually trigger compaction, use `/compact`. This is rarely necessary since the system handles it automatically.

### Session management commands

To view information about the current CLI session, enter:

```copilot
/session
```

To view a list of any session checkpoints, enter:

```copilot
/session checkpoints
```

> \[!NOTE]
> A checkpoint is created when session context is compacted, and allows you to view the summary context that Copilot created.

To view the details of a specific checkpoint, enter:

```copilot
/session checkpoints NUMBER
```

where NUMBER specifies the checkpoint you want to display.

To view any temporary files that have been created during the current session—for example, artifacts created by Copilot that shouldn't be saved to the repository—enter:

```copilot
/session files
```

To view the current plan (if Copilot has generated one), enter:

```copilot
/session plan
```

### Best practice: Keep sessions focused

While infinite sessions allow long-running work, focused sessions produce better results:

* Use `/clear` or `/new` between unrelated tasks.
* This resets context and improves response quality.
* Think of it like starting a fresh conversation with a colleague.

### The `/context` command

Visualize your current context usage with `/context`. It shows a breakdown of:

* System/tools tokens
* Message history tokens
* Free space
* Buffer allocation

## 4. Delegate work effectively

### The `/delegate` command

**Offload work to run in the cloud using Copilot cloud agent.** This is particularly powerful for:

* Tasks that can run asynchronously.
* Changes to other repositories.
* Long-running operations you don't want to wait for.

**Example prompt:**

```copilot
/delegate Add dark mode support to the settings page
```

**What happens:**

* Your request is sent to Copilot cloud agent.
* The agent creates a pull request with the changes.
* You can continue working locally while the cloud agent works.

### When to use `/delegate`

| Use `/delegate`              | Work locally            |
| ---------------------------- | ----------------------- |
| Tangential tasks             | Core feature work       |
| Documentation updates        | Debugging               |
| Refactoring separate modules | Interactive exploration |

## 5. Common workflows

### Codebase onboarding

Use Copilot CLI as your pair programming partner when joining a new project. For example, you could ask Copilot:

* `How is logging configured in this project?`
* `What's the pattern for adding a new API endpoint?`
* `Explain the authentication flow`
* `Where are the database migrations?`

### Test-driven development

Pair with Copilot CLI to develop tests.

* `Write failing tests for the user registration flow`
* *Review and approve the tests.*
* `Now implement code to make all tests pass`
* *Review the implementation.*
* `Commit with message "feat: add user registration"`

### Code review assistance

* ``/review Use Opus 4.5 and Codex 5.2 to review the changes in my current branch against `main`. Focus on potential bugs and security issues.``

### Git operations

Copilot excels at Git workflows:

* ``What changes went into version `2.3.0`?``
* `Create a PR for this branch with a detailed description`
* ``Rebase this branch against `main` ``
* ``Resolve the merge conflicts in `package.json` ``

### Bug investigation

* ``The `/api/users` endpoint returns 500 errors intermittently. Search the codebase and logs to identify the root cause.``

### Refactoring

* `/plan Migrate all class components to functional components with hooks`

  Then answer the questions Copilot asks. Review the plan it creates, and ask Copilot to make changes if necessary. When you are happy with the plan you can prompt:
  `Implement this plan`

## 6. Advanced patterns

### Work across multiple repositories

**Copilot CLI provides flexible multi-repository workflows**—a key differentiator for teams working on microservices, monorepos, or related projects.

**Option 1: Run from a parent directory**

```bash
# Navigate to a parent directory containing multiple repos
cd ~/projects
copilot
```

Copilot can now access and work across all child repositories simultaneously. This is ideal for:

* Microservices architectures
* Making coordinated changes across related repos
* Refactoring shared patterns across projects

**Option 2: Use `/add-dir` to expand access**

```bash
# Start in one repo, then add others (requires full paths)
copilot
/add-dir /Users/me/projects/backend-service
/add-dir /Users/me/projects/shared-libs
/add-dir /Users/me/projects/documentation
```

**View and manage allowed directories:**

```copilot
/list-dirs
```

**Example workflow: coordinated API changes**

```copilot
I need to update the user authentication API. The changes span:

- @/Users/me/projects/api-gateway (routing changes)
- @/Users/me/projects/auth-service (core logic)
- @/Users/me/projects/frontend (client updates)

Start by showing me the current auth flow across all three repos.
```

This multi-repository capability enables:

* Cross-cutting refactors (update a shared pattern everywhere)
* API contract changes with client updates
* Documentation that references multiple codebases
* Dependency upgrades across a monorepo

### Using images for UI work

Copilot can work with visual references. Simply **drag and drop** images directly into the CLI input, paste an image from the clipboard by using <kbd>Ctrl</kbd>+<kbd>V</kbd>, or reference image files in your prompt:

```copilot
Implement this design: @mockup.png
Match the layout and spacing exactly
```

### Checklists for complex migrations

For large-scale changes:

```copilot
Run the linter and write all errors to `migration-checklist.md` as a checklist.
Then fix each issue one by one, checking them off as you go.
```

### Autonomous task completion

Switch into autopilot mode to allow Copilot to work autonomously on a task until it is complete. This is ideal for long-running tasks that don't require constant supervision. For more information, see [Allowing GitHub Copilot CLI to work autonomously](/en/copilot/concepts/agents/copilot-cli/autopilot).

Optionally, you can usually speed up large tasks by using the `/fleet` slash command at the start of your prompt to allow Copilot to break the task into parallel subtasks that are run by subagents. For more information, see [Running tasks in parallel with the \`/fleet\` command](/en/copilot/concepts/agents/copilot-cli/fleet).

## 7. Team guidelines

### Recommended repository setup

* **Create `.github/copilot-instructions.md`** with:
  * Build and test commands
  * Code style guidelines
  * Required checks before commits
  * Architecture decisions

* **Establish conventions** for:
  * When to use `/plan` (complex features, refactoring)
  * When to use `/delegate` (tangential work)
  * Code review processes with AI assistance

### Security considerations

* Copilot CLI requires explicit approval for potentially destructive operations.
* Review all proposed changes before accepting.
* Use permission allowlists judiciously.
* Never commit secrets. Copilot is designed to avoid this, but always verify.

### Measuring productivity

Track metrics like:

* Time from issue to pull request
* Number of iterations before merge
* Code review feedback cycles
* Test coverage improvements

## Getting help

From the command line, you can display help by using the command: `copilot -h`.

For help on various topics enter:

```bash
copilot help TOPIC
```

where `TOPIC` can be one of: `config`, `commands`, `environment`, `logging`, or `permissions`.

### Within the CLI

For help within the CLI, enter:

```copilot
/help
```

To view usage statistics, enter:

```copilot
/usage
```

To submit private feedback to GitHub about Copilot CLI, raise a bug report, or submit a feature request, enter:

```copilot
/feedback
```

## Hands-on practice

Try the [Creating applications with Copilot CLI](https://github.com/skills/create-applications-with-the-copilot-cli) Skills exercise for practical experience building an application with Copilot CLI.

Here is what you will learn:

* Install Copilot CLI
* Use the issue template to create an issue
* Generate a Node.js CLI calculator app
* Expand calculator functionality
* Write unit tests for calculator functions
* Create, review, and merge your pull request

## Further reading

* [About GitHub Copilot CLI](/en/copilot/concepts/agents/about-copilot-cli)
* [Using GitHub Copilot CLI](/en/copilot/how-tos/use-copilot-agents/use-copilot-cli)
* [GitHub Copilot CLI command reference](/en/copilot/reference/copilot-cli-reference/cli-command-reference)
* [Copilot plans and pricing](https://github.com/features/copilot/plans)
