import { ScreenLayout } from "@/components/ScreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <ScreenLayout>
      <View className="flex-1">
        <ThemedText>HomeScreen </ThemedText>
      </View>
    </ScreenLayout>
  );
}
