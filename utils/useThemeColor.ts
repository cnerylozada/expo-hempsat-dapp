import { useColorScheme } from "react-native";
import { Colors } from "@/components/Colors";

export function useThemeColor(colorName: keyof typeof Colors.light) {
  const theme = useColorScheme() ?? "light";
  return Colors[theme][colorName];
}
