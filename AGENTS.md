AGENTS

This document is written for automated/agentic coding assistants that will operate in this repository.
It collects the most important commands, repository conventions, and coding-style rules so agents can make safe, consistent changes.

1) Quick commands (local)

- Install dependencies: `npm ci` (preferred for CI) or `npm install`
- Start dev server: `npm run dev` -> (vite)
- Build for production: `npm run build` -> outputs to `dist/`
- Preview the production build locally: `npm run preview`
- Lint (project): `npm run lint` (runs `eslint .` as configured in `eslint.config.js`)
- Type-check only: `npx tsc --noEmit` (uses `tsconfig.json`)
- Run the CI sequence locally: `npm ci && npm run lint && npm run build` (matches `.github/workflows/ci.yml`)

Notes: `package.json` scripts live in `package.json` (see `dev`, `build`, `lint`, `preview`). The CI file is ` .github/workflows/ci.yml` and uses Node 20.

2) Tests — current state and single-test guidance

- Current repo: there are no dedicated test scripts or test runner configured in `package.json`.

- If you need to run a single test file locally, the recommended modern approach is Vitest. Example commands once Vitest is added as a devDependency:

  - Run a single test file: `npx vitest run path/to/file.test.ts` or `npx vitest run path/to/file.test.tsx`
  - Run a single test by name: `npx vitest -t "partial test name"`

- If you use Jest instead, run a single file or test with:

  - `npx jest path/to/file.test.ts -t "partial test name"`

- Recommendation for adding tests:
  1. Add `vitest`, `@testing-library/react` and `@testing-library/jest-dom` as devDependencies.
  2. Add a `test` script in `package.json`: `"test": "vitest"` and `"test:run": "vitest run"`.
  3. Place unit tests next to components as `ComponentName.test.tsx` or inside `__tests__/` directories.

3) Linting & formatting

- Linting: `npm run lint` runs `eslint .` using `eslint.config.js` (the repo uses `@eslint/js` and `eslint-plugin-react-hooks`).
- Run ESLint on a single file: `npx eslint src/components/ChatWidget.tsx --fix`
- Type-aware lint: this repository currently has an ESLint JS flat config for JS files; TypeScript-focused linting can be introduced by adding `@typescript-eslint` plugins/configs.
- Formatting: the repository does not include Prettier by default. We recommend adding Prettier and running `npx prettier --write .` if you introduce it — keep changes consistent with existing code.

4) Environment & secrets

- Environment files present: `.env.example`, `.env`, `.env.local`.
- DO NOT commit credentials or secrets. If you need a secret for local work, create `.env.local` and add it to `.gitignore` (already common practice here).

5) Important repo files to inspect before making changes

- `package.json` — scripts and dependency lists
- `tsconfig.json` — path aliases and compiler options (see `paths` for `@/*` and `~components/*` etc.)
- `eslint.config.js` — lint rules and global ignores (currently excludes `dist`)
- `.github/workflows/ci.yml` — CI pipeline (runs `npm ci`, `npm run lint`, `npm run build`)
- `src/` — main source tree. Key folders: `src/components`, `src/pages`, `src/features/*`, `src/hooks`, `src/providers`

6) Import & module conventions

- Prefer the path aliases defined in `tsconfig.json` rather than long relative imports when possible:
  - `@/*` -> `src/*`
  - `~components/*` -> `src/components/*`
  - `~hooks/*` -> `src/hooks/*`
  - `~pages/*` -> `src/pages/*`

- Import ordering: keep a consistent, readable ordering:
  1. Node built-ins (if any)
  2. External packages (React, third-party)
  3. Absolute/alias imports (`@/...`, `~components/...`, `~pages/...`)
  4. Relative imports (`./`, `../`)

- Keep one blank line between groups. Use named imports for clarity. Use `import type { ... } from '...'` for type-only imports.

7) TypeScript & typing rules

- Project compiler options are strict (`strict: true`) in `tsconfig.json`. Follow them.
- Use `interface` for exported object shapes (models, props, context values) unless you need advanced unions / mapped types — then use `type`.
- Prefer `unknown` over `any` when receiving untrusted values; narrow `unknown` as early as possible.
- Exported functions and React components should have explicit return types when it improves readability — at a minimum ensure exported APIs are well-typed.
- Use `import type` for types and interfaces to avoid runtime imports.

8) Naming conventions

- Components and pages: PascalCase (e.g. `ChatWidget`, `Home`, `BlogPost`) and filename should match the component name (`ChatWidget.tsx`).
- React hooks: prefix with `use` and use camelCase (e.g. `useTypewriter`, `useChat`).
- Context/providers: `SomethingProvider` (e.g. `ChatProvider`) and hook accessors `useSomething` (e.g. `useChat`).
- Event handlers / callbacks: prefix with `handle` (e.g. `handleSend`, `handleKeyDown`).
- Boolean variables: `is`/`has`/`should` prefix (e.g. `isOpen`, `isLoading`).
- Constants: UPPER_SNAKE_CASE when module-level constants are configuration-like (`SUGGESTED_PROMPTS`, `INITIAL_MESSAGE`) — otherwise PascalCase for exported objects.

9) React & component patterns

- Use function components and hooks (already the dominant pattern here).
- Hooks must be called at the top-level of the component.
- Use `useCallback` / `useMemo` to memoize handlers and values passed to stable children, but only when there is a measurable benefit.
- Prefer small components; lift state up as needed. Use context for app-wide concerns (e.g. the `ChatProvider`).
- For expensive child components, use `React.memo` with stable props.

10) Error handling & async

- Always handle network errors and unexpected data shapes.
- For streaming or cancellable requests, use `AbortController` (this repo already uses it in `streamChat` and `ChatContext`).
- When catching errors, populate user-facing messages in state and log full errors only in dev (or via an observability backend).
- Avoid swallowing errors silently — prefer explicit error states and fallbacks.

11) Accessibility & UX

- Buttons and interactive elements should include `aria-label` when the visual text is insufficient.
- Keyboard interactions: ensure focus management and keyboard shortcuts are non-intrusive (e.g. `Ctrl+.` toggle documented in `ChatWidget`).
- Use semantic HTML elements where possible and keep focus-visible outlines for accessibility.

12) Security

- Any time you inject HTML into the DOM (e.g. `dangerouslySetInnerHTML`) sanitize it first. The project already depends on `dompurify` — use that.
- Treat external input as untrusted. Validate server inputs (workers code) and client-side guardrails.

13) Tailwind / styling

- The project uses Tailwind utility classes. Keep utility usage in components for layout and small styling concerns.
- Avoid embedding large style blocks in components; prefer re-usable classes or component-level CSS when duplication grows.

14) Tests & test patterns (recommendations)

- File layout: place unit tests next to implementation (`Component.test.tsx`) or under `src/__tests__/`.
- Use Testing Library for React components and assert accessible roles instead of implementation details.
- Create small helper utilities to render components with common providers (e.g. SnackbarProvider, ChatProvider) for test setup.

15) Pull requests and commit hygiene

- Before creating a PR: run `npm run lint` and `npx tsc --noEmit` and `npm run build`. CI enforces lint + build.
- Write focused commits; update `README.md` or `CHANGELOG.md` if the change is user-facing.

16) Cursor / Copilot rules

- I checked for Cursor rules under `.cursor/rules/` and for Copilot rules under `.github/copilot-instructions.md` — none were found in this repository. If you add them, document them here and reference their path.

17) Making changes (agent safety checklist)

1. Run `npm ci` and `npx tsc --noEmit` locally before making code changes.
2. Run `npm run lint` and fix issues (or run `npx eslint <file> --fix` for one-off fixes).
3. If you add runtime dependencies, add them to `package.json` and run `npm ci` locally to update lockfile.
4. Do not modify `dist/` — it is a build artifact and should be ignored.
5. Avoid committing secrets from `.env` files.

If you need me to add a testing stack (Vitest + Testing Library) or a formatter (Prettier) I can create the config and scripts — tell me which one you prefer.

Appendix — quick file references

- Lint config: `eslint.config.js`
- Type config & aliases: `tsconfig.json`
- Scripts: `package.json`
- CI: `.github/workflows/ci.yml`
- Chat feature entry: `src/features/chat` (context, api, types)
