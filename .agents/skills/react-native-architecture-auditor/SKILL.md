---
name: react-native-architecture-auditor
description: Audits and guides the location of folders and files in the React Native (Expo Router) frontend under `src/`. Use when creating a new file in `src/`, moving/renaming a file in `src/`, or when the user asks "where should I put X". Does not act on `src/backend/` nor on route files inside `src/app/`.
---

# React Native Architecture Auditor

Frontend folder architecture auditor. Decides where each artifact should live and flags deviations.

## When to act

Trigger the audit in these scenarios:

1. Creating a new file in `src/` (except `src/backend/` and route files in `src/app/`).
2. Moving/renaming a file in `src/`.
3. User question about where to place/organize code.

When touching a file whose current folder violates the architecture, suggest the migration alongside the edit (do not block).

## Response format

Always respond in 3 lines:

```
Verdict: ✅ correct | ⚠️ deviation | ❌ incorrect
Path: <recommended-path>
Reason: <one-line-rule>
```

## Decision tree

Ask in order. Stop at the first match.

If the artifact belongs to the `operations` aggregate and specifically to `details`, `photos`, or `occurrences`, replace `<domain>` with `operations/<submodule>`. Example: `src/features/operations/details/hooks/...`.

1. **Is it an API hook (useQuery / useMutation / useInfiniteQuery)?**
   → Hook: `src/features/<domain>/hooks/use<Operation><Resource>.ts`.
   → API object: `src/features/<domain>/api/<resource>.api.ts` (keep the HTTP object isolated and call it from the hook).
   → Props/response in `src/features/<domain>/interfaces/use<Operation><Resource>Props.ts`.

2. **Is it a non-API React hook?**
   → Used by 2+ domains: `src/hooks/`.
   → Used by 1 domain: `src/features/<domain>/hooks/`.

3. **Is it a UI component?**
   → Used by 2+ domains: `src/components/` (flat; no subfolder named after a domain).
   → Used by 1 domain: `src/features/<domain>/components/`.

4. **Is it a Zustand store?**
   → Global state (session, theme, connectivity): `src/stores/`.
   → Domain-local state: `src/features/<domain>/stores/`.

5. **Is it a TypeScript type?**
   → Shared by 2+ domains: `src/interfaces/`.
   → Domain-specific: `src/features/<domain>/interfaces/`.

6. **Is it a pure utility function?**
   → Shared by 2+ domains: `src/utils/`.
   → Domain-specific: `src/features/<domain>/utils/`.

7. **Is it an API object for a feature?**
   → `src/features/<domain>/api/<name>.api.ts`, imported and called by the feature hook.
   → Shared by 2+ domains: `src/api/<name>.api.ts`.
   → Do not keep these files under `src/backend/**/infra/`.

8. **Is it HTTP client configuration (axios, interceptors)?** → `src/http/clients/`.

9. **Is it third-party library initialization (analytics, posthog)?** → `src/lib/`.
   → Exclude MMKV of `src/utils/`, because it should be in src/backend;

10. **Is it a constant/env/config with no build variation?** → `src/environment/`.

11. **Is it a feature flag?** → `src/flags/`.

12. **Is it an asset (image, font, lottie)?** → `src/assets/`.

13. **Is it an Expo Router route?** → `src/app/...` (out of scope for this skill — use `index.tsx`, never `page.tsx`).

14. **Is it domain/local data code (Drizzle, repositories, use cases)?** → `src/backend/` (out of scope for this skill, except the reference rule above for `*.api.ts`).

## Strict rules

- **No barrel files.** Never create an `index.ts` that just re-exports. Exceptions: route files `src/app/<route>/index.tsx` and files under `src/environment/` that define values directly.
- **English names.** Domain folders, internal folders, components, hooks, stores, types, and utilities. Exception: routes in `src/app/` may use the user's language.
- **camelCase for folders and non-component files.** Multi-word domain folders (`foregroundSync`, `driverChecklist`) and utility files (`appHeaders.ts`) use camelCase. Never use kebab-case (`foreground-sync`, `app-headers.ts`) inside `src/` outside `src/app/`. Components (`*.tsx`), Stores (`*Store.ts`) and Interfaces stay PascalCase — file name mirrors the exported symbol.
- **Only one submodule level.** Default rule: no subdomains. Exception: `src/features/operations/<submodule>/` is allowed for `details`, `photos`, and `occurrences`. Never nest deeper than one level and never keep sibling root domains such as `operationDetails`, `operationPhotos`, or `operationOccurrences`.
- **Feature API objects stay in `features/<domain>/api/`.** Keep the API object isolated from React hooks; hooks in the same feature call it. Promote it to `src/api/` when it is shared by 2+ domains. Never place it under `src/backend/**/infra/`.
- **`src/components/` is flat.** Subfolders only by visual type (`forms/`, `feedback/`). A subfolder named after a domain is a smell — move it to `features/<domain>/components/`.
- **Rule of 2 for promotion.** As soon as a second domain imports the artifact, move it from `features/<d>/` to the equivalent shared folder.
- **No inline components in route files.** A single-use helper component (loading skeleton, error card, empty state) must not be defined inside a route file under `src/app/**` — extract it to `src/features/<domain>/components/<Name>/index.tsx`. Exception: components of at most 5 lines may stay inline.
- **`*.api.ts` exports one object with named methods.** Each `<recurso>.api.ts` exports a single `<recurso>Api` object with one method per operation (`recursoApi.getX()`, `recursoApi.postX()`, ...) — never a standalone function — when the resource has more than one operation.
- **App-shell components are never defined inline in `src/app/**`.** ErrorBoundary, providers, and global wrappers live in `src/components/<Name>/index.tsx` and are imported directly from there. Exception: Expo Router requires `_layout.tsx` to export `ErrorBoundary`, so the layout only re-exports it (`export { ErrorBoundary } from "@/components/ErrorBoundary"`) — never define the body in the route file.
- **Navigation components stay thin.** Navigators (especially in `_layout.tsx`) only read state and render routes. Bootstrap logic (loading fonts, token validation, splash screen, initial fetches) must be extracted to `src/hooks/<name>.ts` (e.g. `src/hooks/useBootstrap.ts`).

## Naming conventions

| Type | Convention | Example |
|------|------------|---------|
| Folder (domain, submodule, internal) | camelCase | `foregroundSync/`, `driverChecklist/`, `operations/details/` |
| Component | PascalCase | `OrderCard.tsx` |
| Hook | camelCase with `use` | `useDebounce.ts`, `useGetOrders.ts` |
| Store | PascalCase with `Store` | `SessionStore.ts` |
| Interface | PascalCase | `OrderProps.ts`, `ApiResponse.ts` |
| Utility | camelCase | `formatCurrency.ts`, `appHeaders.ts` |
| Expo route | `index.tsx` (never `page.tsx`) | `src/app/orders/index.tsx` |

Never use kebab-case (`foreground-sync/`, `app-headers.ts`) inside `src/` outside `src/app/`. Rule of thumb: file name mirrors the exported symbol — `export const appHeaders = ...` → `appHeaders.ts`; `export function MediaCard()` → `MediaCard.tsx`.

## Details and edge cases

See [REFERENCE.md](REFERENCE.md) for:

- Full map of `src/`
- How feature API objects are separated from hooks
- Smell examples and their fixes
- How to suggest legacy migrations without blocking
