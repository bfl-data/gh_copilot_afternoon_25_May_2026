# Node Demo (Copilot Training)

A small Node.js + TypeScript training project used for GitHub Copilot demos.

## Overview

This repository contains intentionally simple (and sometimes intentionally imperfect) demo files used in guided sessions.

## Tech Stack

- Node.js (>= 20)
- TypeScript
- Express
- Vitest
- bcrypt
- pino

## Project Files

- `array-utils.ts`
  - Utility helpers (`head`, `last`, `chunk`) and a demo bug in `findLastEven` for fix exercises.
- `users.route.ts`
  - Minimal Express route handler with adjacent Vitest coverage in `users.route.test.ts`.
- `auth.controller.ts`
  - Express-style auth controller with in-memory user storage and inline password hashing/verification for refactor demos.
- `price-calculator.ts`
  - Placeholder file used for comment-driven development exercises.
- `package.json`
  - Project metadata, the focused test script, dependencies, and engine requirements.

## Scripts

- `npm test` - Run the Vitest suite once

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npm test
```

## Notes

- Some files are intentionally set up for live training tasks (bug fixing, refactoring, and scaffold-from-comments workflows).
- This workspace is intentionally file-oriented for training and does not include a runnable app entrypoint by default.
