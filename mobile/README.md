# Scheduler Mobile

Expo Router mobile application using TypeScript, Uniwind and React Native Reusables conventions.

## Prerequisites

- Bun
- Android Studio with an Android emulator
- Backend available at `http://localhost:8000`

## Setup

```sh
bun install
cp .env.example .env
```

The default Android emulator API URL is `http://10.0.2.2:8000/api`. Override it with `EXPO_PUBLIC_API_URL` when needed.

## Run on Android

```sh
bun run android
```

The project keeps Expo's iOS and web support available through `bun run ios` and `bun run web`.

## Quality checks

```sh
bun run lint
bun run format:check
bun test
```

Formatting can be applied with `bun run format`.

The initial screen is intentionally minimal and only verifies that the Scheduler application starts. Appointment flows, API services, authentication, Zustand stores and persistence are not part of this setup.
