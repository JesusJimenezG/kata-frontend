# Copilot Instructions — Kata Frontend

## Project Overview

React Native (Expo SDK 54) app for a **Resource Management & Reservation Platform**. Uses Expo Router for file-based routing, NativeWind (Tailwind CSS) for styling, TanStack React Query for server state, and Axios for HTTP. The backend is a separate Spring Boot API at `http://localhost:8080`.

## Detailed Instructions

Specific rules are delegated to focused instruction files under `.github/instructions/`:

| File                                                                                            | Scope                                                                                        |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [general-development.instructions.md](instructions/general-development.instructions.md)         | Tech stack, project structure, service module pattern, code conventions, commands            |
| [git-workflow.instructions.md](instructions/git-workflow.instructions.md)                       | Direct-to-main workflow, conventional commits, commit guidelines                             |
| [functional-requirements.instructions.md](instructions/functional-requirements.instructions.md) | Source-of-truth docs, domain rules (auth, resources, reservations), UI & validation rules    |
| [ai-usage-documentation.instructions.md](instructions/ai-usage-documentation.instructions.md)   | How to document AI tool usage per `REQUIREMENTS.md`, review guidelines for AI-generated code |

## Quick Reference

- **All commands run from `app/`**: `cd app && pnpm install && pnpm start`
- **Service module pattern**: `*Service.ts` → `use*.ts` → `index.ts` (see `services/api/auth/`)
- **Types**: all API interfaces live in `app/src/services/api/types.ts`, must match `API_CONTRACT.md`
- **Styling**: NativeWind `className` prop, never `style` objects
- **No manual memoization**: React Compiler handles it
- **Backend**: must be running at `localhost:8080`
