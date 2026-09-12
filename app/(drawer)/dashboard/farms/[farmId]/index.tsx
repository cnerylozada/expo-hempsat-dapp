import { SectionTitle } from "@/components/SectionTitle";
import { FarmInfoCard } from "@/components/farms/FarmInfoCard";
import { queryKeys } from "@/libs/queryKeys";
import { IFarm } from "@/server/models";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

export default function MyFarm() {
  const { farmId } = useGlobalSearchParams<{ farmId: string }>();
  const queryClient = useQueryClient();
  const farm = queryClient.getQueryData<IFarm>(
    queryKeys.farms.farmById(farmId),
  );

  if (!farm) return null;

  return (
    <View className="flex-1 gap-6">
      <View className="gap-3">
        <SectionTitle title="MyFarm" icon="flower" />
        <FarmInfoCard farm={farm} />
      </View>
      <View>
        <SectionTitle title="Areas defined in this farm" icon="flower" />
      </View>
    </View>
  );
}
