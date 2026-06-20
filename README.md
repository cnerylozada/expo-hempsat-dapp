# HempSat dApp

An Expo / React Native app for HempSat, integrating [thirdweb](https://thirdweb.com) for wallet/blockchain features.

> **Expo Go is not supported.** This project requires a development build (native modules: thirdweb adapter, expo-secure-store, expo-camera, etc.).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a `.env` file at the root:

   ```
   EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
   EXPO_PUBLIC_API_URL=http://<your-lan-ip>:3000/api/v1
   EXPO_PUBLIC_PERSONA_TEMPLATE_ID=your_persona_template_id
   ```

   `EXPO_PUBLIC_API_URL` must point to a host reachable from your device/emulator (a LAN IP, not `localhost`, when testing on a physical device). Update it whenever your dev machine's network changes.

3. Build and run a development build

   ```bash
   npx expo run:android
   # or
   npx expo run:ios
   ```

4. For subsequent runs, once the native build exists, you can just start Metro:

   ```bash
   npx expo start
   ```

## Other commands

```bash
# Regenerate native folders after adding new native packages
npx expo prebuild --clean

# Type check
npx tsc --noEmit

# Lint
npx expo lint
```

## Architecture

See [CLAUDE.md](./CLAUDE.md) for details on routing, the thirdweb integration, provider composition, and the React Query data-fetching conventions used in this codebase.

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [thirdweb React Native docs](https://portal.thirdweb.com/react-native/v0)
