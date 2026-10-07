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
- `app/(drawer)/` — drawer navigator (main shell): `home`, `login`, `dashboard`
- `app/(drawer)/dashboard/` — `farms/` and `identification/`
- `app/camera.tsx` — full-screen camera route, outside the drawer

Farms nest by level, and **each level has its own `_layout.tsx` that lists only its direct children** (a parent never names a grandchild):

```
farms/                         Stack: index, register-farm, [farmId]/(tabs), [farmId]/areas
  [farmId]/(tabs)/             Tabs: index (farm), conditions
  [farmId]/areas/              Stack: register-area, [areaId]
    register-area.tsx          register an area (named like register-farm)
    [areaId]/                  Stack: (tabs), practices
      (tabs)/                  Tabs: index (area), practices (list)
      practices/               Stack: register-summary (pick a practice), register-practice, [practiceId] (detail)
```

- A folder next to a `Tabs` layout becomes a tab, so a screen that must not be a tab goes in a sibling Stack (e.g. `areas/register-area.tsx`), not in the `(tabs)` group.
- A nested layout is registered in its parent with `headerShown: false` (e.g. `[farmId]/areas`, `practices`), otherwise the header is drawn twice.
- Fixed names (`register-area`, `register-practice`) win over dynamic segments (`[areaId]`).
- A register form is always pushed from the screen below it, so on success it leaves with `router.back()` (register-farm, register-area). `router.replace` would push a second copy of the list.
- Typed routes (`experiments.typedRoutes`) regenerate only when Metro starts. A new route shows as a `tsc` error until `npx expo start` has run once.
- A screen sets its header title at runtime through the navigator that owns it: `useNavigation("/(drawer)/dashboard/farms/[farmId]/areas/[areaId]").setOptions({ title })` (see the area detail screen).

### Thirdweb Integration

- `libs/thirdweb.ts` — exports `thirdwebClient` (singleton). Import this wherever blockchain calls are needed.
- `@thirdweb-dev/react-native-adapter` is imported in `index.js` as a polyfill before anything else.
- `metro.config.js` has `unstable_enablePackageExports: true` and `unstable_conditionNames` required by thirdweb.
- `package.json` overrides `react-native-quick-base64` to `3.0.0` to fix a JSI compatibility issue with React Native new architecture (which is enabled).

### Providers

- `providers/AppProviders.tsx` — wraps the root with `ThirdwebProvider`, `QueryClientProvider`, `AuthProvider`, and `PhotoProvider`, in that order. Mounted once in `app/_layout.tsx`, which additionally mounts `GluestackUIProvider` and the local `ThemeProvider` (the latter stays in `_layout.tsx` since it depends on the `useColorScheme()` hook).
- `providers/AuthProvider.tsx` — manages the JWT session via `expo-secure-store` under the key `"jwt"`.
- `providers/PhotoProvider.tsx` — camera/gallery photo capture state.

### Data Fetching

- `@tanstack/react-query` is used for all server data fetching; avoid manual `useState`/`useEffect`/`useFocusEffect` fetch patterns for new screens.
- `libs/queryKeys.ts` — single source of truth for query keys, organized by domain (e.g. `queryKeys.farms.myFarms`, `queryKeys.users.myUser`). Use these keys for both `useQuery` and any `invalidateQueries` calls — do not inline ad-hoc key arrays.
- `server/*.ts` — one file per domain (`server/farms.ts`, `server/users.ts`, `server/auth.ts`) exporting fetch functions that take a `token: string | null`. Get that token from `useAuth()` in the calling screen — do not call `SecureStore.getItemAsync("jwt")` directly; `AuthProvider` already holds it. (Two screens still do the direct read: `dashboard/farms/register-farm.tsx:78` and `dashboard/identification/validate-id-card.tsx:31`. Both are mutations, not queries; migrate them when touched. These line numbers drift — `register-farm.tsx` in particular gets restructured often — so if the read isn't at that line, `grep -n "SecureStore.getItemAsync" -r app` before assuming it's gone.)
- `server/http.ts` — `throwIfNotOk(response, fallbackMessage?)` is the shared error path for every `server/*.ts` fetch. It parses the JSON body and throws `TokenExpiredError(body.error)` when `body.code === "TOKEN_EXPIRED"`, otherwise `Error(body?.error ?? fallbackMessage)` — so `useQuery`'s `error.message` reflects the backend's actual error.
- `components/authedRequests.ts` — `useAuthedQuery(queryKey, queryFn)` wraps `useQuery` and calls `onSignOut()` when the query throws `TokenExpiredError`, then rethrows. **Use this instead of bare `useQuery` for any authenticated request**, otherwise an expired token leaves the user in a signed-in UI making failing calls.
- `components/farms/schemas.ts` — `registerFarmSchema`, the single zod schema for the register-farm form (`name`, `titleDeedPhotoList`, `location`, `boundaries`). Each field pairs its type check with a custom message (e.g. `z.object({...}, { message: "Location is required" })` for the missing case, `.min(n, "...")` for a length/count check) — match that shape rather than leaving a field to fall back to zod's generic error.
- `server/weather-metrics.ts` — fetches 5-day forecast from Open-Meteo (`fetchFiveDayForecast`). Uses the `openmeteo` SDK with `daily` (temperature, weather_code) and `hourly` (relative_humidity_2m) variables. Returns `IForecast[]`.
- `server/models.ts` — single file for shared domain types returned by the `server/*.ts` fetch functions. Raw backend shapes are `IRaw*` (snake_case) and the mapped ones drop the `Raw` (`IRawFarm` → `IFarm`, `IRawAreaSummary` → `IAreaSummary`, `IRawAreaDetail` → `IAreaDetail`); screens only see the mapped types.
- `server/areas.ts` — areas of a farm (`byFarmId`, `byId` keys in `queryKeys.areas`). Practices have no server file yet: their screens are scaffolding and the list on `practices.tsx` is mock data.

### Authentication

- `providers/AuthProvider.tsx` manages the JWT session. On mount it reads the token from `SecureStore` and calls `isTokenExpired(token)` (client-side JWT `exp` decode, no network call) — if already expired, it calls `onSignOut()` immediately instead of leaving the user in a half-authenticated state.
- `server/auth.ts` — `signIn`/`signOut` (POST `/auth/sign-in`, `/auth/sign-out`, same throw-on-`!response.ok` convention as other `server/*.ts` files); `getTokenExpiry`/`isTokenExpired` decode the JWT payload locally.
- **Two distinct expiry paths.** Expiry _before_ mount is caught by `AuthProvider`'s `isTokenExpired` check (local decode). Expiry _during_ a session is caught server-side: the backend returns `code: "TOKEN_EXPIRED"`, `throwIfNotOk` turns it into `TokenExpiredError`, and `useAuthedQuery` signs the user out. Both are needed — neither covers the other's case.
- **Wallet auto-connect gotcha**: `ConnectButton` mounts an internal `<AutoConnect>` by default, which forwards whatever `onConnect` prop you gave it. On `app/(drawer)/login.tsx` this means a still-valid wallet session would silently reconnect and re-fire the sign-in flow with no user interaction — hence `login.tsx`'s `ConnectButton` always sets `autoConnect={false}`. Dashboard's `ConnectButton` (`app/(drawer)/dashboard/index.tsx`) keeps the default (enabled) — it has no `onConnect` handler, and it only ever mounts once `isAuthenticated` is already `true`, so silently reconnecting there is safe and desired (keeps the wallet connected across app restarts for an already-valid session).
- **Disconnect gotcha**: always disconnect via the `useDisconnect()` hook's `disconnect(wallet)`, never call `wallet.disconnect()` directly. The manager-level `disconnect` clears the persisted `LAST_ACTIVE_EOA_ID` (what `AutoConnect` checks on next launch); calling `wallet.disconnect()` directly skips that, so the wallet silently reconnects on the next app open despite having been "signed out."

### Weather

- `server/weather-metrics.ts` — Open-Meteo integration. Fetches `temperature_2m_max`, `temperature_2m_min`, `weather_code` (daily) and `relative_humidity_2m` (hourly, averaged per day). Returns `Promise<IForecast[]>` for 5 days.
- `components/farms/utils.ts` — `getWeatherInfo(code)` maps WMO weather codes to `{ icon, label }`. `getDayLabel(date, index)` returns `"Today"` for index 0 or a short weekday name (UTC timezone to avoid offset issues).
- `components/farms/WeatherForecastCard.tsx` — displays the 5-day forecast: today in a full-width row, the next 4 days in a compact horizontal row below.

### Maps & Geolocation

- `react-native-maps` (`MapView`, `Marker`, `Polygon`, `Polyline`), Google-provided (`PROVIDER_GOOGLE`). The API key lives in `app.json > android.config.googleMaps.apiKey`, hardcoded rather than sourced from `.env` — there's a matching `GOOGLE_MAPS_API_KEY` already sitting in `.env`, but no `app.config.ts` exists to read it into `app.json` (static JSON can't read `process.env`), so that variable is currently unused. The key isn't a secret in the usual sense — it ships in every built APK regardless of where it's sourced from — what actually protects it is the Android application restriction (package name + signing SHA-1) set in Google Cloud Console; moving it to `.env`/`app.config.ts` would be repo hygiene (keeps it out of `git log`), not a security fix.
- `components/shared/` — a file goes here if it **knows nothing about a specific feature** (generic UI, generic validation) **or is used by two or more features**. Anything else stays in its feature folder (`components/farms/` — register-farm-specific fields like `FarmLocationField`, `FarmBoundaryField` — or `components/areas/register-area/`) until a second feature needs it, then moves up. A generic file belongs here even with a single caller today (`AppModal`, `InfoCard`); `TimeUnderPracticeField` and `SignAndSaveAreaModal` stay in `areas/register-area/` because they carry area-specific copy. Root `components/` keeps only layout/navigation (`ScreenLayout`, `StackHeaderLeft`, `LoadingScreen`, `ThemedText`). Currently: the generic UI set — `AppButton`, `AppTextInput`, `AppNumberInput`, `AppRadioGroup`, `AppSelect`, `AppModal`, `StatusBanner`, `InstructionsCard`, `InfoCard`, `FieldRow`, `SectionTitle`; `Stepper` (steps of ONE form: "Step 1 of 4", the current step's name and one bar per step; display only, the screen owns the step and the Back/Next buttons; finished bars are tappable when `onStepPress` is given) and `FlowProgress` (where the user is in a flow of several screens: `variant="list"` explains the flow, `variant="compact"` is the one-row summary for the page that starts it; no numbers, a check means done; each step has a `subtitle` for the list and a `shortSubtitle` for the compact row) — keep the two apart; `PhotoGallery` (thumbnail row + full-screen viewer with zoom, built on `react-native-image-viewing`, no native code); `PhotoListField`, `useCameraPhotos`, `MapHeader`; `models.ts` (what areas and practices both use: `TILLAGE_PRACTICES`, `PRACTICE_COLORS`, typed by `TillagePractice` from `server/models.ts`, which also holds `CROPS`/`Crop`; the form-only lists derived from them, `tillagePracticeOptions` and `cropOptions`, live in `areas/register-area/models.ts`); `schemas.ts` (`photoShape`, the base rules every photo shares — no pixel-size rule on purpose, each form adds its own `.refine`: `farms/schemas.ts` requires portrait ≥ 600×900 for title deeds, `areas/register-area/schemas.ts` accepts either orientation); `BoundaryDrawingMap.tsx` (the full-screen map surface for drawing a farm's boundary — long-press to drop a point, `Polyline` at 2 points, filled `Polygon` at 3+), `BoundaryDrawingPanel.tsx` (its bottom overlay: map-type toggle, point/area readout, Confirm/Reset/Done), and `utils.ts` (the `LatLng` type, `polygonAreaInSquareMeters`/`formatArea` — shoelace formula on an equirectangular projection, no geodesic library is installed for this — and the shared `Alert.alert(...)` copy for the location-off/permission-denied cases).
- **`BoundaryDrawingMap` needs a real `Modal`, not inline rendering.** Its root is `flex-1`, which only resolves to a real full-screen size against a container that has full-screen bounds. `FarmBoundaryField` (in `components/farms/`) is what actually uses it, and it's nested inside `register-farm.tsx`'s `ScrollView` — rendering `BoundaryDrawingMap` directly there gives it nothing bounded to fill, and in practice its native `MapView` can end up measuring against the raw window instead, ignoring the screen's own safe-area layout (status bar included). `FarmBoundaryField` wraps it in RN's `Modal` (first and, so far, only use of `Modal` in this codebase) instead. Leave `statusBarTranslucent` unset — its default `false` is what keeps the modal's own window off the status bar on Android; `BoundaryDrawingMap`'s header also adds `useSafeAreaInsets().top` itself as a second layer, in case it's ever hosted some other way.
- `expo-location` — `hasServicesEnabledAsync()` (the device's location toggle) and `getForegroundPermissionsAsync()` (this app's permission) are independent; permission can be `"granted"` while location is off, and either way a silently-absent blue dot on the map gives no error to react to. Check both, as `BoundaryDrawingMap` and `FarmLocationField` do.

### Layout Conventions

- `components/ScreenLayout.tsx` — full-screen padded wrapper (`flex-1 p-4`). Pass directly as `screenLayout={ScreenLayout}` on any `Stack` navigator. For `Drawer` screens (which do not support `screenLayout`), import and wrap the screen's return value with `<ScreenLayout>` directly in the screen file.
- `components/StackHeaderLeft.tsx` — renders `HeaderBackButton` (calls `router.back()`) when `canGoBack`, otherwise `DrawerToggleButton`. Add to any `Stack` via `screenOptions={{ headerLeft: (props) => <StackHeaderLeft {...props} /> }}`. Do not use `useNavigation` + `StackActions.pop()` — that dispatches to the parent Drawer navigator and throws a POP warning.
- `components/LoadingScreen.tsx` — centered `ActivityIndicator` (`flex-1 justify-center items-center`, `size="large"`). Use for any full-screen loading state instead of inlining the same `View`/`ActivityIndicator` pair.

### Practices (`components/practices/`)

Everything specific to the practices flow. `utils.ts` holds `PRACTICES`, one `PracticeInfo` per practice (`id`, `name`, `summary`, and an `info` block with the sheet's `title`, `about`, `benefits` and `asks`). The three MVP practices are `mulching`, `organic_amendments` and `cover_crops`, and the ids are a guess until they are checked against the backend. Adding a practice later means adding one entry; the components below take a `PracticeInfo` and know nothing else about a practice.

- The practice colours live in `PRACTICE_COLORS` (`components/shared/models.ts`, a `Record<PracticeType, string>` like `TILLAGE_PRACTICES`), not in `PracticeInfo`, so anything that shows a practice can read them. They are 6-digit hex strings on purpose, because they go into inline `style` (the dot) and cannot be theme tokens. Look them up by the practice's `id`.
- `PracticeLabel` — the colour square plus the name; it takes only `name` and `color`, not a `PracticeInfo`. `size` is only `"md"` (default) or `"lg"`, and `"lg"` is for `PracticeOption`, the one place the name is the card's title.
- `PracticeOption` — one choice in "which practice?". Only the radio selects, the rest of the card does nothing, and the info icon calls `onInfoPress`. No form library: the screen holds the selected id.
- `PracticeInfoSheet` — the "what is this practice?" sheet, rendered once per screen (see Bottom sheets). It takes `practice` (optional, nothing is drawn without one) and `onClose`.
- `PracticeCard` — one practice in an area's list. It takes an `IPracticeSummary` and maps it itself (practice from `PRACTICES`, crop label, "start – end/today" period, tillage label). It is active when `finished_at` is `null`: highlighted, "In progress" pill, "See details" button; otherwise a plain card with a chevron centred on the right, and the whole card is pressable. A `type` missing from `PRACTICES` renders nothing.
- `PRACTICE_FLOW_STEPS` (in `utils.ts`) — Start / Check in / Close, for `FlowProgress`. `PRACTICE_RULES` — the "before you start" notes, shown with the shared `InstructionsCard`.
- `practices/register-summary.tsx` uses all of these: `FlowProgress` on step 0, one `PracticeOption` per practice, an `InstructionsCard` with `PRACTICE_RULES`, and one `PracticeInfoSheet`. A footer button stays disabled until a practice is picked, then pushes `register-practice` with `{ farmId, areaId, type }`.
### Bottom sheets

Use gluestack's `components/ui/bottomsheet`, the way `IdentityCardSheet` does: the screen wraps its content in `<BottomSheet ref>` (context only, draws nothing), renders one `*Sheet` component built from `BottomSheetPortal` + `BottomSheetBackdrop` + `BottomSheetDragIndicator` + `BottomSheetContent` next to the content, and opens it with `ref.current?.open()` / `close()`.

- **The sheet must be rendered at the screen's top level, not inside a card or a list item.** This sheet is not a modal and is drawn inside its parent view, so inside a card it would be sized to the card. For a list, keep the selected item in state, render one sheet, and let each item only call an `onInfoPress`.
- Always keep `BottomSheetPortal` mounted and gate only its content (`{practice && ...}`), because `open()` does nothing if the sheet has not mounted yet.
- `@gorhom/bottom-sheet`'s `BottomSheetModal` was tried and dropped: it needs a `BottomSheetModalProvider` in `app/_layout.tsx` and is a second way to do the same thing.
- Needs the `GestureHandlerRootView` already in `app/_layout.tsx`.

### Theming

Colors come from CSS custom properties, not a TypeScript palette. `components/ui/gluestack-ui-provider/config.ts` defines them via NativeWind's `vars()` for `light` and `dark`, and `tailwind.config.js` exposes them as `rgb(var(--token)/<alpha-value>)` utilities (`bg-primary`, `text-foreground`, `border-border`, `text-destructive`, …).

Read the scheme with **nativewind's** `useColorScheme`, not react-native's — `GluestackUIProvider` drives the theme through NativeWind, so react-native's hook can report a different value than what is actually rendered:

```ts
import { useColorScheme } from "nativewind";
const { colorScheme } = useColorScheme();
```

`ConnectButton`'s `theme` prop takes `colorScheme` directly rather than a `colorScheme ?? "dark"` fallback: the prop is optional and thirdweb already defaults to `"dark"`, so a hardcoded fallback only risks contradicting the system scheme.

- `components/ThemedText.tsx` and `components/ThemedButton.tsx` — pre-gluestack primitives. `ThemedText` supports types: `default`, `title`, `defaultSemiBold`, `subtitle`, `subtext`. Being replaced by gluestack components; prefer gluestack for new UI. Concretely, that replacement is a small app-level component library built on the vendored gluestack primitives — `components/shared/AppButton.tsx` (themed/outline button, replaces `ThemedButton`), `components/shared/StatusBanner.tsx` (success/warning/error banner with an optional action), `components/shared/InstructionsCard.tsx` (numbered tips card) — all following the same recipe: `Box`/`Pressable`/`Text` + a `cssInterop`'d `Ionicons` in the same file, styled entirely with theme-token classNames (`bg-primary`, `text-muted-foreground`, …), never the old palette. Reach for one of these before writing a new one-off styled `View`.
- **`AppButton` icons.** The icon always sits after the text (`AppButton` has no position prop, on purpose). The rules:
  - Add an icon only when it says something faster than the words: a recognisable object or tool (add, camera, map, location, wallet, fingerprint, lock). Generic verbs get no icon: Save, Review and save, Confirm, Done, Cancel, Back. An icon on every button stops meaning anything.
  - `chevron-forward` means "takes you to another screen or step" (See details, Continue with …).
  - Always the `-outline` Ionicons variant; chevrons have no filled version, so they stay plain.
  - One meaning, one icon: create/start `add-circle-outline`, boundary `map-outline`, identity `finger-print-outline`, sign `wallet-outline`, photo `camera-outline`, location `locate-outline`, retry/reset `refresh-outline`, navigate `chevron-forward`.
  - Never an icon on Cancel or another dismiss action, so the main action of a pair stands out.
  - Text is a sentence-case verb phrase ("Start verification", not "Start Verification").
- The old custom palette (`tint`, `text`, `subtext`, `text-inverted`) was dropped when `tailwind.config.js` was replaced with gluestack's, and no call site uses it any more. Classes like `bg-tint` or `text-text` generate nothing, so use the theme tokens above instead.

### UI Components (gluestack-ui v4 alpha)

Components are **vendored source**, not an imported library — the CLI copies files into `components/ui/<name>/`. Edit them freely, but prefer keeping them at upstream defaults so future `add` runs don't surprise you.

Adding components:

```bash
npx gluestack-ui@4.1.0-alpha.4 add <name> [<name> ...] && rm -f .npmrc && npm install
```

- **Always `rm -f .npmrc && npm install` afterwards.** The CLI's own install already ran with `legacy-peer-deps` and pruned the auto-installed peers (the build then fails with `Project with path ':react-native-nitro-modules' could not be found`), so deleting `.npmrc` alone does not bring them back; the plain `npm install` does. Check `git diff --stat package-lock.json`: thousands of deleted lines mean the peers are still missing. `installDependencies` calls `ensureLegacyPeerDeps()` unconditionally as its first step, which runs `npm config --location=project set legacy-peer-deps=true`. That flag disables npm's auto-installed peers, and `react-native-nitro-modules` exists in this tree _only_ as an auto-installed peer of `react-native-quick-crypto` and `react-native-mmkv`. It fires even for components that install nothing.
- **Batch components into one call** — one clone/pull, one install, one `.npmrc` to delete. Already-present components are filtered out, so re-listing them is a no-op.
- **Pin the CLI version.** A bare `npx gluestack-ui` resolves to `latest`, which is on the 5.x line. Today that still emits identical files — both `4.1.0-alpha.4` and `5.0.3` hardcode `branchName: 'main-v4-alpha'` for `add`, and neither reassigns it (the `v4-nativewind`/`v4-uniwind`/`main` strings in the 5.x build belong to `commands/upgrade.js` as version labels, not clone targets). But that constant can change in any release, and the failure would be silent rather than loud: a v5 `gluestack-ui-provider/index.tsx` carries no tokens and mounts cleanly while theming nothing. Pinning also avoids a re-download each time `latest` moves, since a prerelease version never satisfies npx's cache check.
- The pin guards against CLI changes, not branch changes — both versions read the same `main-v4-alpha` branch, cached at `~/.gluestack/cache/gluestack-ui`. Components are vendored, so committing them is what actually freezes them.
- `--template-only` does **not** skip dependency installation (it only skips the git pull). There is no flag that does.

**At least 8 of the 58 components change the dependency tree** — this table is what we've hit, not an exhaustive audit of all 58, so don't assume a component not listed here is safe; check `git diff package.json` after adding one regardless. The CLI installs their declared ranges verbatim, which can move versions backwards:

| Component           | Dependency                                      | Effect                                             |
| ------------------- | ----------------------------------------------- | -------------------------------------------------- |
| `date-time-picker`  | `react-native-reanimated@^3.0.0`                | **downgrade from 4.1.x — breaks RN 0.81 New Arch** |
| `image-viewer`      | `react-native-gesture-handler@~2.30.0`          | moves off SDK 54's `~2.28.0` pin                   |
| `calendar`          | `date-fns@^3.0.0`                               | bump from 2.30.0                                   |
| `bottomsheet`       | `@gorhom/bottom-sheet@^5`                       | new                                                |
| `checkbox`, `radio` | `lucide-react-native@^0.510.0`                  | new                                                |
| `liquid-glass`      | `expo-glass-effect`                             | new, native → rebuild                              |
| `date-time-picker`  | `@react-native-community/datetimepicker@^8.4.4` | new, native → rebuild                              |
| `badge`             | `react-native-svg@^15.15.5`                     | moves off SDK 54's exact `15.12.1` pin             |

For those, follow up with `npx expo install --fix` (or, to only correct the one package it actually moved rather than everything `--fix` would touch, `npx expo install <package>@<sdk-expected-version>` — check the expected version with `npx expo install --check`). `input` and `form-control` were both added without moving anything.

**`components/ui/gluestack-ui-provider/` must stay on the v4 file set.** Copying it from the repo's `main` branch yields v5 files, which fail differently depending on the file: `index.next.tsx` and `index.uniwind.tsx` break the bundle outright (they import a nonexistent `./config` and the uninstalled `uniwind`), while the v5 `index.tsx` carries no tokens at all and would mount cleanly while theming nothing — a silent failure. The provider is mounted with `mode="system"` in `app/_layout.tsx`; the default is `mode="light"`, which calls `setColorScheme("light")` and pins the whole app to light.

`components/ui/button/index.tsx` produces 4 `tsc --noEmit` errors (the `cssInterop` config keys and an `ActivityIndicator` `size` prop). These are upstream gluestack source, not project code, and don't affect the build — Babel strips types.

### Path Alias

`@/` maps to the project root (configured in `tsconfig.json`).

## Key Constraints

- **New Architecture is enabled** (`newArchEnabled: true`). Native packages must support it.
- **Android minSdkVersion is 26** (required by `react-native-aes-gcm-crypto`), set in both `app.json > android.minSdkVersion` and the `expo-build-properties` plugin.
- **iOS OpenSSL fix not yet applied** — before running `npx expo run:ios`, add `extraPods` for `OpenSSL-Universal` in `app.json` under the `expo-build-properties` plugin (version `3.3.2000` for Xcode 16, `3.1.5004` for Xcode 15).
- **`.env` is gitignored but was previously committed** — it has been removed from tracking (`git rm --cached`), but old secrets remain in git history until that history is rewritten.
- **`react-aria` and `react-stately` are pinned to exact versions — do not add `^`.** `@gluestack-ui/core` and `@gluestack-ui/utils` import 22 scoped `@react-aria/*` / `@react-stately/*` packages (13 + 9) while declaring only the two umbrella packages, relying on them to pull the scoped ones in. The umbrellas stopped doing that: `react-aria` went from 42 dependencies at 3.47.0 to 9 at 3.48.0, and `react-stately` from 26 at 3.45.0 to 6 at 3.46.0. Any float past those versions breaks the bundle with `Unable to resolve "@react-aria/utils"`. Hence `react-aria: "3.47.0"` and `react-stately: "3.45.0"`, exact.
- **The nine `@react-stately/*` packages are direct dependencies _and_ `overrides`, both exact.** Both halves are required. The `overrides` block stops the 3.10.x wrapper versions (which depend on `react-stately@^3.46.0`) from being selected; declaring them as direct dependencies is what guarantees npm hoists them to the top level of `node_modules` where Metro can resolve them. Without the direct declaration npm nests them under `react-stately/node_modules/` and the bundle fails.
- **Avoid `--legacy-peer-deps`** — it disables npm's auto-installed peers, and `react-native-nitro-modules` is present only as such a peer (of `react-native-quick-crypto` and `react-native-mmkv`). This is why `.npmrc` must be deleted after every `gluestack-ui add`.
- **Verify after any dependency change** with `npx expo export --platform android`, which catches resolution failures that `tsc` cannot.
