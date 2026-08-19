# Contributing a new component

## Folder convention

```
src/components/<category>/<ComponentName>/
  ├── ComponentName.tsx        # Implementation
  ├── ComponentName.stories.tsx # Storybook stories
  ├── index.ts                 # Re-export
  └── README.md                # Props table + usage
```

**Categories:** `media` · `navigation` · `data` · `forms` · `feedback` · `animation` · `utility` · `future`

## Step-by-step

1. **Create the folder** inside the right category under `src/components/`.
2. **Write the component** — always use CSS custom properties from `@antrosys/tokens` (no hardcoded hex values).
3. **Export props interface** — all public props must be typed and exported.
4. **Write stories** — at minimum: one story per variant and one loading/disabled state.
5. **Write README** — include a Props table and a copy-paste usage example.
6. **Add to barrel** — export from `src/index.ts` under the correct category comment.
7. **Open a PR** — the template checklist will guide you.

## Token usage

```tsx
// ✅ Good
style={{ color: "var(--ant-color-brand-primary)" }}

// ❌ Bad
style={{ color: "#7C3AED" }}
```

## Naming conventions

- Components: `PascalCase`
- Props interfaces: `ComponentNameProps`
- Files: `PascalCase.tsx`
- Stories title: `Category/ComponentName`
