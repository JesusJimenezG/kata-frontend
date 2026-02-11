# Functional Requirements Rules

## Source of Truth

- **`REQUIREMENTS.md`** (repo root) — full project scope and acceptance criteria.
- **`API_CONTRACT.md`** (repo root) — endpoint specs, request/response shapes, error formats.
- **`app/src/services/api/types.ts`** — TypeScript interfaces that must mirror the API contract exactly.

When building a feature, always cross-reference these three sources. If a type in `types.ts` doesn't match `API_CONTRACT.md`, fix `types.ts` first.

## Domain Areas

### 1. Authentication

- Register and login with email/password.
- JWT-based: `accessToken` + `refreshToken` stored via `tokenStorage`.
- Token refresh is handled transparently by `client.ts` interceptors — screens don't manage tokens.
- Two roles: regular user and `ROLE_ADMIN`.

### 2. Resource Management (CRUD)

- List, detail, create, edit, delete (soft-delete via `active` flag).
- Create/edit/delete are **admin-only** (🔒 endpoints).
- Resource names must be unique — handle 409 conflicts in the UI.
- Resources have a `ResourceType` (separate entity with its own CRUD).

### 3. Reservations & Availability

- Create reservations with `resourceId`, `startTime`, `endTime`.
- Backend prevents overlapping reservations (409 on conflict).
- Cancel: allowed by the reservation creator or any admin.
- Availability endpoint returns `AvailabilitySlot[]` for a given resource + time window.
- Listings: all active, my active, my history, resource history.

## UI Requirements

- **Availability view**: table or calendar showing available/reserved slots per resource.
- **Role-based UI**: admin-only actions (create/edit/delete resource) are hidden from regular users.
- **Error feedback**: display backend error `message` field to users on validation/conflict errors.
- **Date/time format**: ISO-8601 (`yyyy-MM-dd'T'HH:mm:ss`) for API calls; display in human-readable format in the UI.

## Validation Rules

- All form fields marked as required (✅) in `API_CONTRACT.md` must be validated before submission.
- Show inline validation errors — don't rely solely on backend responses.
- Email format validation on auth forms.
- `startTime` must be before `endTime` on reservation forms.
