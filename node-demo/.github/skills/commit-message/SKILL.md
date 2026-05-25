---
name: commit-message
description: >
  Use this skill whenever the developer asks to write, format, or improve
  a Git commit message. Triggers on phrases like "write a commit message",
  "help me commit", or "how should I describe this change".
---
# Commit Message Formatter
Write commit messages using the **Conventional Commits** standard.
## Format
<type>(<scope>): <short summary>
<optional body — what changed and why, not how>
<optional footer — BREAKING CHANGE, issue refs>
## Types
| Type     | When to use                                    |
|----------|------------------------------------------------|
| feat     | New feature or capability                      |
| fix      | Bug fix                                        |
| refactor | Code restructured, no behaviour change         |
| perf     | Performance improvement                        |
| test     | Adding or updating tests                       |
| docs     | Documentation only                             |
| chore    | Build scripts, CI config, dependency updates   |
## Rules
- Summary line: max 72 characters, imperative mood ("add", not "added")
- Body: explain *why*, not *what* — the diff already shows what
- Reference Jira/GitHub issues in footer: `Closes #123` or `Refs PROJ-456`
- If a change breaks the API contract, add `BREAKING CHANGE:` in the footer
## Examples
**Minimal:**
fix(payments): handle null response from gateway timeout
**With body and footer:**
feat(auth): add refresh token rotation
Tokens are now rotated on each use to reduce the window of exposure if a token is stolen. Previous tokens are invalidated immediately on refresh.
Closes #892