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
- `auth.controller.ts`
  - Express-style auth controller with in-memory user storage and inline password hashing/verification for refactor demos.
- `price-calculator.ts`
  - Placeholder file used for comment-driven development exercises.
- `package.json`
  - Project metadata, scripts, dependencies, and engine requirements.

## Scripts

- `npm run dev` - Start dev mode with `tsx watch src/index.ts`
- `npm run build` - Compile TypeScript with `tsc`
- `npm run start` - Run compiled app from `dist/index.js`
- `npm run typecheck` - Run type-checking without emit
- `npm run test` - Run tests with Vitest

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run type-check:

```bash
npm run typecheck
```

3. Run tests:

```bash
npm run test
```

## Notes

- Some files are intentionally set up for live training tasks (bug fixing, refactoring, and scaffold-from-comments workflows).
- This repo may include partial/demo-only structure depending on the session stage.
