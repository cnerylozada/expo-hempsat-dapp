import { AppButton } from "@/components/AppButton";
import { ScreenLayout } from "@/components/ScreenLayout";
import { FarmBoundaryMap } from "@/components/shared/FarmBoundaryMap";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { View } from "react-native";

export default function HomeScreen() {
  const [isDrawingBoundary, setIsDrawingBoundary] = useState(false);

  if (isDrawingBoundary) {
    return <FarmBoundaryMap onExit={() => setIsDrawingBoundary(false)} />;
  }

  return (
    <ScreenLayout>
      <View className="flex-1 gap-3">
        <Text>HomeScreen</Text>

        <AppButton
          text="Draw farm boundary"
          icon="expand-outline"
          onPress={() => setIsDrawingBoundary(true)}
        />
      </View>
    </ScreenLayout>
  );
}
