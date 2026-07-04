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

Requires a `.env` file at the root (not committed — see Key Constraints) with:
```
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:3000/api/v1
EXPO_PUBLIC_PERSONA_TEMPLATE_ID=your_persona_template_id
```

The thirdweb client is initialized in `libs/thirdweb.ts` and will throw at startup if `EXPO_PUBLIC_THIRDWEB_CLIENT_ID` is missing.

`EXPO_PUBLIC_API_URL` must point to a host reachable from the device/emulator (a LAN IP, not `localhost`, when testing on a physical device). This IP changes whenever the dev machine reconnects to a network — update `.env` and restart Metro when requests start hanging in a perpetual loading state.

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
- `metro.config.js` has `unstable_enablePackageExports: true` and `unstable_conditionNames` required by thirdweb.
- `package.json` overrides `react-native-quick-base64` to `3.0.0` to fix a JSI compatibility issue with React Native new architecture (which is enabled).

### Providers
- `providers/AppProviders.tsx` — wraps the root with `ThirdwebProvider`, `QueryClientProvider`, `AuthProvider`, and `PhotoProvider`, in that order. Mounted once in `app/_layout.tsx` alongside the local `ThemeProvider` (which stays in `_layout.tsx` since it depends on the `useColorScheme()` hook).
- `providers/AuthProvider.tsx` — manages the JWT session via `expo-secure-store` under the key `"jwt"`.
- `providers/PhotoProvider.tsx` — camera/gallery photo capture state.

### Data Fetching
- `@tanstack/react-query` is used for all server data fetching; avoid manual `useState`/`useEffect`/`useFocusEffect` fetch patterns for new screens.
- `libs/queryKeys.ts` — single source of truth for query keys, organized by domain (e.g. `queryKeys.farms.myFarms`, `queryKeys.users.myUser`). Use these keys for both `useQuery` and any `invalidateQueries` calls — do not inline ad-hoc key arrays.
- `server/*.ts` — one file per domain (`server/farms.ts`, `server/users.ts`) exporting fetch functions that take a `token: string | null` (read via `SecureStore.getItemAsync("jwt")` in the calling screen) and throw `Error(body?.error)` parsed from the JSON response when `!response.ok`, so `useQuery`'s `error.message` reflects the backend's actual error.
- `server/weather-metrics.ts` — fetches 5-day forecast from Open-Meteo (`fetchFiveDayForecast`). Uses the `openmeteo` SDK with `daily` (temperature, weather_code) and `hourly` (relative_humidity_2m) variables. Returns `IForecast[]`.
- `server/models.ts` — single file for shared domain interfaces (`IUser`, `IFarm`, `IForecast`) returned by the `server/*.ts` fetch functions.

### Weather
- `server/weather-metrics.ts` — Open-Meteo integration. Fetches `temperature_2m_max`, `temperature_2m_min`, `weather_code` (daily) and `relative_humidity_2m` (hourly, averaged per day). Returns `Promise<IForecast[]>` for 5 days.
- `components/farms/utils.ts` — `getWeatherInfo(code)` maps WMO weather codes to `{ icon, label }`. `getDayLabel(date, index)` returns `"Today"` for index 0 or a short weekday name (UTC timezone to avoid offset issues).
- `components/farms/WeatherForecastCard.tsx` — displays the 5-day forecast: today in a full-width row, the next 4 days in a compact horizontal row below.

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
- **`.env` is gitignored but was previously committed** — it has been removed from tracking (`git rm --cached`), but old secrets remain in git history until that history is rewritten.
