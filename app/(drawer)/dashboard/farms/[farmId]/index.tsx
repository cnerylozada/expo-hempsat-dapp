import { AppButton } from "@/components/AppButton";
import { AreaCard } from "@/components/areas/AreaCard";
import { useAuthedQuery } from "@/components/authedRequests";
import { FarmBoundaryViewer } from "@/components/farms/FarmBoundaryViewer";
import { FarmInfoCard } from "@/components/farms/FarmInfoCard";
import { SectionTitle } from "@/components/SectionTitle";
import { StatusBanner } from "@/components/StatusBanner";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getAreasByFarmId } from "@/server/areas";
import { IFarm } from "@/server/models";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useGlobalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function MyFarm() {
  const { farmId } = useGlobalSearchParams<{ farmId: string }>();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const farm = queryClient.getQueryData<IFarm>(
    queryKeys.farms.farmById(farmId),
  );

  const {
    data: areaList,
    isLoading: isAreaListLoading,
    isRefetching: isAreaListRefetching,
    isError: isAreaListError,
    error: areaListError,
    refetch: refetchAreaList,
  } = useAuthedQuery(queryKeys.areas.byFarmId(farmId), () =>
    getAreasByFarmId(token, farmId),
  );

  if (!farm) return null;

  return (
    <View className="flex-1 gap-6">
      <View className="gap-3">
        <SectionTitle title="MyFarm" icon="flower" />
        <FarmInfoCard farm={farm} />
        <FarmBoundaryViewer boundaries={farm.boundaries} />
      </View>

      <View className="gap-3">
        <SectionTitle title="Areas defined in this farm" icon="flower" />

        <Link
          href={{
            pathname: "/(drawer)/dashboard/farms/register-area",
            params: { farmId },
          }}
          asChild
        >
          <AppButton text="Register new area" icon="add-circle-outline" />
        </Link>

        {(isAreaListLoading || isAreaListRefetching) && (
          <View className="items-center">
            <ActivityIndicator size="large" />
          </View>
        )}

        {!isAreaListLoading && isAreaListError && (
          <StatusBanner
            theme="error"
            title="Something went wrong"
            description={areaListError.message}
            action={{
              icon: "refresh",
              label: "Retry",
              onPress: () => refetchAreaList(),
            }}
          />
        )}

        {!isAreaListLoading &&
          !isAreaListError &&
          (areaList?.length === 0 ? (
            <StatusBanner
              theme="warning"
              title="No areas defined yet"
              description="Areas you mark inside this farm will show up here."
            />
          ) : (
            <View className="gap-3">
              {areaList?.map((area) => (
                <AreaCard key={area.id} farmItem={area} />
              ))}
            </View>
          ))}
      </View>
    </View>
  );
}
