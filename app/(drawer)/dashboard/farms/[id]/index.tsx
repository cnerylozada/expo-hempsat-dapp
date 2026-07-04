import { ThemedText } from "@/components/ThemedText";
import { queryKeys } from "@/libs/queryKeys";
import { IFarm } from "@/server/models";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

export default function MyFarm() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const farm = queryClient.getQueryData<IFarm>(queryKeys.farms.farmById(id));

  return (
    <View className="flex-1">
      <ThemedText>MyFarm: {farm?.id}</ThemedText>
    </View>
  );
}
