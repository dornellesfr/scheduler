---
name: react-native-typescript-guardrails
description: Applies and reviews TypeScript type-safety rules for React Native codebases. Use when writing, refactoring, or reviewing .ts/.tsx files, checking type safety, explicit typing, and compliance with project typing rules.
---

# React Native TypeScript Guardrails

Use this skill for React Native TypeScript work that needs typing guidance.

## When to use

See [REFERENCE.md](REFERENCE.md) for the detailed rules and review workflow.

## Quick check

1. Check only touched `.ts` and `.tsx` files.
2. If the user provides files that are not `.ts` or `.tsx`, inform them this guardrail applies only to TypeScript files and ignore those files in the review.
3. Load and apply the rule set from [REFERENCE.md](REFERENCE.md).
4. If `REFERENCE.md` is not present in your current context, read it from this skill folder before proceeding.
5. Treat the rules in [REFERENCE.md](REFERENCE.md) as mandatory unless the user explicitly asks for a narrower scope.
6. Use `scripts/check-typescript-guide.py` only if the user explicitly requests a quick scan, or if the change set has more than 5 modified TypeScript files.

## Output

- For reviews, always report the rule, file, and line.
- If the exact line number cannot be determined, report the file and the closest function or component name.
- For implementation help, keep changes minimal and consistent with the existing codebase.
