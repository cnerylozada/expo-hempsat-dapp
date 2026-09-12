import { ScreenLayout } from "@/components/ScreenLayout";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(20),
  description: z.string().min(30),
});

export default function RegisterAreaForm() {
  const { farmId } = useLocalSearchParams<{ farmId: string }>();

  return (
    <ScreenLayout>
      <View className="flex-1">
        <Text>RegisterFarmForm {farmId}</Text>
      </View>
    </ScreenLayout>
  );
}
