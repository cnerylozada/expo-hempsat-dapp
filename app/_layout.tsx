import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppProviders } from "@/providers/AppProviders";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import "react-native-reanimated";
import "./global.css";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <AppProviders>
      <GluestackUIProvider mode="system">
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(drawer)" />
          </Stack>
        </ThemeProvider>
      </GluestackUIProvider>
    </AppProviders>
  );
}
