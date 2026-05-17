# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run on Android (development build — Expo Go is NOT supported)
npx expo run:android

# Run on iOS (development build)
npx expo run:ios

# Regenerate native folders after adding new native packages
npx expo prebuild --clean

# Start Metro bundler only (for an already-built app)
npx expo start

# Type check
npx tsc --noEmit

# Lint
npx expo lint
```

## Environment

Requires a `.env` file at the root with:
```
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
```

The thirdweb client is initialized in `libs/thirdweb.ts` and will throw at startup if this variable is missing.

## Architecture

### Routing
File-based routing via expo-router. The entry point is `index.js` (not `app/`), which imports the thirdweb polyfill adapter before `expo-router/entry` — this order is mandatory.

Route structure:
- `app/index.tsx` — redirects to `/(drawer)/home`
- `app/(drawer)/` — drawer navigator (main shell)
- `app/tabs/` — tab navigator nested inside the drawer, with Connect and Read tabs

### Thirdweb Integration
- `libs/thirdweb.ts` — exports `thirdwebClient` (singleton). Import this wherever blockchain calls are needed.
- `@thirdweb-dev/react-native-adapter` is imported in `index.js` as a polyfill before anything else.
- `ThirdwebProvider` wraps the root in `app/_layout.tsx`.
- `metro.config.js` has `unstable_enablePackageExports: true` and `unstable_conditionNames` required by thirdweb.
- `package.json` overrides `react-native-quick-base64` to `3.0.0` to fix a JSI compatibility issue with React Native new architecture (which is enabled).

### Theming
- `components/Colors.ts` — color palette for light/dark.
- `utils/useThemeColor.ts` — hook to look up a color key from the current scheme.
- `components/ThemedText.tsx` and `components/ThemedButton.tsx` — themed primitives. `ThemedText` supports types: `default`, `title`, `defaultSemiBold`, `subtitle`, `link`, `subtext`.

### Path Alias
`@/` maps to the project root (configured in `tsconfig.json`).

## Key Constraints

- **New Architecture is enabled** (`newArchEnabled: true`). Native packages must support it.
- **Android minSdkVersion is 26** (required by `react-native-aes-gcm-crypto`), set in both `app.json > android.minSdkVersion` and the `expo-build-properties` plugin.
- **iOS OpenSSL fix not yet applied** — before running `npx expo run:ios`, add `extraPods` for `OpenSSL-Universal` in `app.json` under the `expo-build-properties` plugin (version `3.3.2000` for Xcode 16, `3.1.5004` for Xcode 15).
