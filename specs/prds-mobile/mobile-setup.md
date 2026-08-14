# PRD: Mobile Setup

## Problem Statement

O diretorio `mobile/` ainda nao possui um aplicativo Expo funcional. Atualmente ele contem apenas a configuracao Docker para iniciar o Expo, sem projeto TypeScript, Expo Router, sistema de estilos, gerenciamento de estado, cache de consultas, persistencia ou ferramentas de qualidade.

Isso impede o inicio seguro do modulo mobile de agendamento de consultas definido na especificacao do teste. A equipe precisa de uma base pequena, executavel no emulador Android e alinhada as bibliotecas escolhidas, sem antecipar estruturas de dominio ou instalar dependencias que nao serao usadas.

## Solution

Inicializar o aplicativo dentro de `mobile/` usando o template oficial Expo Router com Uniwind, configurar React Native Reusables e TypeScript estrito, e adicionar somente as dependencias de infraestrutura aprovadas: Zustand, Async Storage, TanStack Query, Axios, Lucide, Prettier, Jest e React Native Testing Library.

A base tera uma tela inicial minima para validar a inicializacao, um `QueryClientProvider` no layout raiz, uma instancia Axios configuravel por ambiente e um teste de fumaca. A execucao sera documentada para Android, inicialmente usando o emulador Android e a API local em `10.0.2.2:8000`.

## User Stories

1. As a mobile developer, I want an Expo project initialized inside the mobile directory, so that I can start implementing the appointment scheduling module.
2. As a mobile developer, I want the existing mobile Dockerfile preserved, so that the current container workflow is not broken by the setup.
3. As a mobile developer, I want TypeScript enabled in strict mode, so that new code has compile-time type safety from the beginning.
4. As a mobile developer, I want Expo Router configured, so that navigation follows the official file-based routing convention.
5. As a mobile developer, I want the official Router and Uniwind starter configuration, so that the styling setup does not depend on custom bootstrap code.
6. As a mobile developer, I want React Native Reusables configured with Uniwind, so that future UI components can follow the library's expected conventions.
7. As a mobile developer, I want Uniwind and Tailwind CSS configured, so that React Native components can use the chosen utility-style styling system.
8. As a mobile developer, I want Zustand available, so that local application state can be added without introducing a heavier state framework.
9. As a mobile developer, I want Async Storage available, so that local persistence can be added when a concrete persistence requirement exists.
10. As a mobile developer, I want TanStack Query available, so that server state and API cache can be managed consistently when API queries are implemented.
11. As a mobile developer, I want the root layout to provide a Query Client, so that all future routes can use TanStack Query without duplicating providers.
12. As a mobile developer, I want query data to remain fresh for two minutes, so that normal screen revisits do not make unnecessary requests.
13. As a mobile developer, I want failed queries retried twice for transient failures, so that temporary network or server problems can recover automatically.
14. As a mobile developer, I want client errors such as validation failures not to be retried, so that invalid requests do not generate redundant traffic.
15. As a mobile developer, I want Axios configured as the HTTP client, so that future API calls share one consistent client.
16. As a mobile developer, I want the API base URL configurable through `EXPO_PUBLIC_API_URL`, so that the same app setup works across local environments.
17. As an Android emulator user, I want the documented local API example to use `10.0.2.2`, so that the emulator can reach the host machine's backend.
18. As a mobile developer, I want Axios requests to time out after ten seconds, so that a stalled backend does not leave the app waiting indefinitely.
19. As a mobile developer, I want no authentication interceptors in the initial client, so that the setup does not anticipate an authentication flow that is explicitly out of scope.
20. As a mobile developer, I want Lucide React Native available, so that future reusable components can use a consistent icon set.
21. As a mobile developer, I want a minimal initial screen named Scheduler, so that I can verify the application starts without prematurely implementing business screens.
22. As an Android developer, I want the application identifier to be `com.scheduler.mobile`, so that the Android package has a stable project identity.
23. As an Android developer, I want Android to be the documented execution target, so that the first validation path matches the current development environment.
24. As a mobile developer, I want the default Expo support configuration preserved for other platforms, so that Android focus does not require destructive platform changes.
25. As a mobile developer, I want Bun to be the only package manager used by the project, so that dependency installation and lockfile behavior remain consistent with the repository infrastructure.
26. As a mobile developer, I want the stable Expo-compatible versions selected by the official template, so that native dependencies remain mutually compatible.
27. As a mobile developer, I want the selected JavaScript libraries installed at stable compatible versions, so that the initial stack is reproducible without unnecessary version overrides.
28. As a mobile developer, I want ESLint retained from the Expo template, so that basic code-quality checks exist without replacing the framework defaults.
29. As a mobile developer, I want Prettier configured with its default behavior, so that formatting is consistent without adding arbitrary style rules.
30. As a mobile developer, I want Jest configured with the Expo preset, so that tests execute in an Expo-compatible environment.
31. As a mobile developer, I want React Native Testing Library configured, so that future tests can verify user-visible behavior at the component boundary.
32. As a mobile developer, I want one smoke test for the initial screen, so that the basic test runner and render pipeline are validated immediately.
33. As a mobile developer, I want scripts for Android, linting, formatting, format checking and tests, so that the expected development checks are discoverable and repeatable.
34. As a mobile developer, I want a mobile-specific README, so that setup, environment variables, Android execution and checks are documented near the application.
35. As a repository maintainer, I want the implementation changes limited to the mobile project, so that backend and root infrastructure remain untouched by this setup task.

## Implementation Decisions

- Initialize the application with the official Expo Router and Uniwind starter template.
- Use TypeScript with strict checking. This is an intentional decision that supersedes the original test PDF and repository note that mention JavaScript.
- Keep the official Expo Router route structure and avoid introducing a custom `src` architecture or domain layers during setup.
- Configure React Native Reusables as a component convention with Uniwind. Do not add NativeWind or a second styling system.
- Preserve the existing Dockerfile and do not modify root Docker Compose or backend files.
- Use Bun for all dependency installation and project scripts, producing the Bun lockfile only.
- Add Zustand and Async Storage as available infrastructure, but do not create a store or persistence middleware before a concrete state requirement exists.
- Add TanStack Query and create one root Query Client provider.
- Configure the Query Client with a two-minute stale time and two retries. Retry only network failures and HTTP 5xx responses; do not retry HTTP 4xx responses.
- Add Axios as the HTTP client and expose one base client configured through `EXPO_PUBLIC_API_URL`.
- Set the Axios timeout to ten seconds. Do not add authentication interceptors or global domain-specific error handling yet.
- Document `http://10.0.2.2:8000/api` as the initial Android emulator example through `mobile/.env.example`; the actual environment file is not part of the repository setup.
- Add `lucide-react-native` for future reusable UI components, without building a component library in this task.
- Keep the initial route as a minimal Scheduler screen that confirms the app is running. Do not implement appointment booking, appointment history, filtering, cancellation or API domain services.
- Set the Android application identifier to `com.scheduler.mobile`.
- Keep Expo's default platform compatibility while documenting Android as the first execution target.
- Retain the template ESLint setup and add Prettier with default formatting behavior.
- Configure Jest with `jest-expo` and React Native Testing Library.
- Add scripts for Android execution, linting, formatting, format checking and testing.
- Create a mobile README describing prerequisites, Bun commands, environment configuration, Android emulator execution and quality checks.
- The implementation must not add application files outside `mobile/`. The PRD itself is stored under `specs/prds-mobile` as requested.

## Testing Decisions

- Tests must verify externally observable behavior, such as whether the initial screen renders the Scheduler identity, rather than implementation details such as component internals or provider construction.
- Add one smoke test at the screen rendering seam using React Native Testing Library. It should prove that the Expo/Jest render pipeline can load the initial route and display the expected initial content.
- Validate the TanStack Query provider configuration through the application bootstrap/build checks rather than testing library internals. Query behavior tests belong with real API queries in a later feature.
- Validate the Axios setup through type checking, module loading and the configured environment contract. Request and error behavior tests should be added when API services exist.
- Run the highest available repository checks for this setup: TypeScript validation, ESLint, Prettier check, Jest and Expo Android startup configuration.
- There is no existing mobile test prior art because `mobile/` currently contains only the Dockerfile. The initial smoke test establishes the first testing seam for later screens.

## Out of Scope

- Appointment booking flow.
- Appointment history, status filters, refresh action, detail view or cancellation.
- API service modules, DTOs, domain models or backend integration.
- Authentication, patient registration or user accounts.
- Zustand stores, Async Storage persistence and persisted user data.
- Custom design tokens, product branding, custom themes or a complete component library.
- Additional React Native Reusables components beyond the configuration needed for future use.
- Native modules, custom Expo plugins, custom development builds or platform-specific native code.
- Removing iOS or web compatibility from the Expo project.
- CI/CD, release builds, app signing, store metadata or deployment automation.
- Changes to the backend, root Docker Compose, root README or other files outside the requested PRD and mobile setup scope.

## Further Notes

- The source specification defines the product as a mobile consultation scheduling module and originally names JavaScript. The decision to use TypeScript comes from the explicit developer clarification during planning and should be documented as an intentional deviation.
- The repository currently has a backend container exposing port 8000 and a mobile container exposing Expo port 8081. The mobile setup should preserve this infrastructure while local Android development uses the emulator host alias for API access.
- The branch for implementation is `feat/dornellesfr/mobile-setup`, created from `test`.
- The setup should remain intentionally small: every installed dependency must correspond to an approved stack item or to the minimum configuration required by Expo, React Native Reusables, Uniwind, testing or formatting.
