# AGENTS.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Project Source of Truth

The project requirements are defined by `specs/260803-teste-dev-mobile.pdf`. When implementation decisions conflict with the specification, use the PDF as the source of truth and document any intentional deviation.

Current infrastructure direction:

- `backend/`: Laravel-compatible PHP 8.2+ API.
- `mobile/`: React Native with Expo using TypeScript.
- Node-compatible tooling: Bun.
- Docker database: PostgreSQL provisionally, until the application stack is defined further.

## Mobile Development

- Treat `specs/260803-teste-dev-mobile.pdf` and the applicable PRD under `specs/prds-mobile/` as the product source of truth.
- Any work under `/mobile` must load and follow the repository skills `react-native-architecture-auditor`, `react-native-code-style` and `react-native-typescript-guardrails`.
- Keep new mobile route files under `mobile/src/app/` and follow the architecture skill for non-route files under `mobile/src/`.
- Use the existing Expo Router and QueryClientProvider infrastructure unless the applicable PRD explicitly changes it.
- The mobile visual baseline uses automatic light/dark themes, neutral backgrounds and surfaces, readable neutral text, blue for primary actions and selected navigation, spacing in multiples of four, and discreet borders and rounding.
