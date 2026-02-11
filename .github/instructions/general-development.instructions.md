# General Development Rules

## Tech Stack

- **Runtime**: React Native (Expo SDK 54) with React 19
- **Language**: TypeScript with `strict: true` — no `any` types, no `@ts-ignore`
- **Styling**: NativeWind (Tailwind CSS via `className` prop on RN components)
- **Navigation**: Expo Router (file-based routing in `app/app/`)
- **Server state**: TanStack React Query v5
- **HTTP client**: Axios with centralized interceptors (`client.ts`)
- **Package manager**: pnpm — always run from the `app/` directory

## Project Structure

```
app/                        ← Expo project root (cd here for all commands)
  app/                      ← File-based routes (_layout.tsx, index.tsx, …)
  src/
    components/             ← Reusable UI components
    services/api/           ← API layer
      types.ts              ← All TypeScript interfaces (mirrors API_CONTRACT.md)
      client.ts             ← Axios instance + auth interceptors + token refresh
      tokenStorage.ts       ← AsyncStorage wrapper for JWT tokens
      auth/                 ← Example domain module (3-file pattern)
```

## Service Module Pattern

Every API domain (auth, resources, reservations) follows a **3-file structure** inside `services/api/<domain>/`:

| File          | Purpose                                      | Example                     |
| ------------- | -------------------------------------------- | --------------------------- |
| `*Service.ts` | Raw Axios calls, returns typed data          | `authService.ts`            |
| `use*.ts`     | React Query hooks (`useQuery`/`useMutation`) | `useAuth.ts`                |
| `index.ts`    | Barrel re-export of service + hooks          | `export { authService, … }` |

**Query key factories** — define a `<domain>Keys` object per module (see `authKeys` in `useAuth.ts`).

When creating a new domain, copy the `auth/` folder and adapt.

## Code Conventions

- **No manual memoization**: React Compiler (`babel-plugin-react-compiler`) handles it — skip `useMemo`/`useCallback`/`React.memo` unless profiling shows a need.
- **Barrel exports**: Every module folder gets an `index.ts` that re-exports its public API.
- **Types live in `types.ts`**: All API request/response interfaces stay in `services/api/types.ts` to match `API_CONTRACT.md`. Don't scatter type definitions across service files.
- **Token handling is automatic**: `client.ts` interceptors attach the Bearer token and handle 401 → refresh → retry. Service functions don't manage tokens.
- **Use `className` not `style`**: NativeWind Tailwind classes via `className` prop on all RN components (`View`, `Text`, `Pressable`, etc.).

## Commands

```bash
cd app
pnpm install              # install deps
pnpm start                # Expo dev server
pnpm ios / pnpm android   # platform-specific
pnpm web                  # web version
```

Backend must be running at `localhost:8080`.
