# AI Usage Documentation Rules

- The README `## AI Usage` section is for entries only.
- Before any commit, ask whether to add an entry to AI usage.
- Entries must be written in español.
- If no entry is needed, the response should be "no entry" and the git workflow continues.

## Format in README

Maintain an `## AI Usage` section in `README.md` as a bullet list:

```markdown
## AI Usage

- **<área>**: <descripción de lo generado, herramienta usada, modificaciones y criterio aplicado>
```

## Guidelines for AI-Assisted Code

- **Review all generated code** against `API_CONTRACT.md` types and endpoint paths — AI may hallucinate endpoints or fields.
- **Verify TypeScript types** — ensure generated interfaces match `types.ts` exactly; don't create duplicate or divergent type definitions.
- **Don't blindly accept** — if AI suggests `useMemo`/`useCallback`, remove them (React Compiler handles optimization). If it adds `style` props instead of `className`, convert to NativeWind.
