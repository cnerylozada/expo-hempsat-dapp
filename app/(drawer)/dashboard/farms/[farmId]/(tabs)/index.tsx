import { AreaCard } from "@/components/areas/AreaCard";
import { useAuthedQuery } from "@/components/authedRequests";
import { FarmBoundaryViewer } from "@/components/farms/FarmBoundaryViewer";
import { FarmInfoCard } from "@/components/farms/FarmInfoCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AppButton } from "@/components/shared/AppButton";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { StatusBanner } from "@/components/shared/StatusBanner";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getAreasByFarmId } from "@/server/areas";
import { getMyFarmById } from "@/server/farms";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyFarm() {
  const { farmId } = useGlobalSearchParams<{ farmId: string }>();
  const { token } = useAuth();
  const navigation = useNavigation("/(drawer)/dashboard/farms");
  const { bottom } = useSafeAreaInsets();

  const {
    data: farm,
    isLoading: isFarmLoading,
    isError: isFarmError,
    error: farmError,
    refetch: refetchFarm,
    isRefetching: isFarmRefetching,
  } = useAuthedQuery(queryKeys.farms.farmById(farmId), () =>
    getMyFarmById(token, farmId),
  );

  const {
    data: areaList,
    isLoading: isAreaListLoading,
    isError: isAreaListError,
    error: areaListError,
    refetch: refetchAreaList,
    isRefetching: isAreaListRefetching,
  } = useAuthedQuery(queryKeys.areas.byFarmId(farmId), () =>
    getAreasByFarmId(token, farmId),
  );

  useEffect(() => {
    if (farm?.name) {
      navigation.setOptions({ title: farm.name });
    }
  }, [farm?.name, navigation]);

  if (
    isFarmLoading ||
    isFarmRefetching ||
    isAreaListLoading ||
    isAreaListRefetching
  )
    return <LoadingScreen />;

  return (
    <View className="flex-1 gap-6">
      <View className="gap-3">
        <SectionTitle title="MyFarm" icon="flower" />

        {isFarmError ? (
          <StatusBanner
            theme="error"
            title="Something went wrong"
            description={farmError.message}
            action={{
              icon: "refresh",
              label: "Retry",
              onPress: () => refetchFarm(),
            }}
          />
        ) : (
          farm && <FarmInfoCard farm={farm} />
        )}

        {isAreaListError ? (
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
        ) : (
          farm && (
            <FarmBoundaryViewer
              boundaries={farm.boundaries}
              areaList={areaList}
            />
          )
        )}
      </View>

      <View className="flex-1">
        <SectionTitle title="Areas defined in this farm" icon="flower" />

        <View className="mt-3 mb-6">
          <Link
            href={{
              pathname: "/(drawer)/dashboard/farms/register-area",
              params: { farmId },
            }}
            asChild
          >
            <AppButton text="Register new area" icon="add-circle-outline" />
          </Link>
        </View>

        {!isAreaListError &&
          (areaList?.length === 0 ? (
            <StatusBanner
              theme="warning"
              title="No areas defined yet"
              description="Areas you mark inside this farm will show up here."
            />
          ) : (
            <FlatList
              className="flex-1"
              contentContainerClassName="gap-6"
              data={areaList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Link
                  href={{
                    pathname:
                      "/(drawer)/dashboard/farms/[farmId]/areas/[areaId]",
                    params: { farmId, areaId: item.id },
                  }}
                  asChild
                >
                  <AreaCard areaSummary={item} />
                </Link>
              )}
            />
          ))}
      </View>
    </View>
  );
}
