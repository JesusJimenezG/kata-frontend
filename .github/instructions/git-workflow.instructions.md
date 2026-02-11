# Git Workflow Rules

## Workflow

This is a **4-hour kata** — all work is committed and pushed directly to `main`. No feature branches or PRs.

## Commit Messages

Follow **Conventional Commits** format:

```
<type>(<scope>): <short description>
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`  
**Scopes**: `auth`, `resources`, `reservations`, `ui`, `api`, `config`

Examples:

```
feat(auth): add login screen with form validation
fix(api): handle 409 conflict on duplicate resource name
refactor(reservations): extract availability query hook
docs(readme): add AI usage section
```

## Commit Guidelines

- **One logical change per commit** — don't mix a feature with unrelated refactors.
- **Keep commits buildable** — each commit should compile and not break the app.
- Service + hook + screen for a new feature can go in one commit if they're tightly coupled.
- Commit and push frequently to show progress.
