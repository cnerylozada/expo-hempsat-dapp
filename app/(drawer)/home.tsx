import { ScreenLayout } from "@/components/ScreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonText } from "@/components/ui/button";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScreenLayout>
      <View className="flex-1">
        <ThemedText>HomeScreen </ThemedText>
        <View>
          <Text className="text-red-400">Lucciano</Text>
        </View>

        <Button variant="outline">
          <ButtonText>Press me</ButtonText>
        </Button>

        <Button variant="outline">
          <ButtonText>Pay your debts!</ButtonText>
        </Button>
      </View>
    </ScreenLayout>
  );
}
