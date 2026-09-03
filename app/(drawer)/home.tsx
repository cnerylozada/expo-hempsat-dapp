import { ScreenLayout } from "@/components/ScreenLayout";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <ScreenLayout>
      <View className="flex-1 gap-3">
        <Text>HomeScreen </Text>
      </View>
    </ScreenLayout>
  );
}
