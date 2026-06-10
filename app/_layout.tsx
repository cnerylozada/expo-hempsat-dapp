import { AuthProvider } from "@/providers/AuthProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { ThirdwebProvider } from "thirdweb/react";
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThirdwebProvider>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="auto" />
          <Slot />
        </ThemeProvider>
      </AuthProvider>
    </ThirdwebProvider>
  );
}
