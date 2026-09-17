import { AppButton } from "@/components/AppButton";
import { AreaCard } from "@/components/areas/AreaCard";
import { useAuthedQuery } from "@/components/authedRequests";
import { FarmBoundaryViewer } from "@/components/farms/FarmBoundaryViewer";
import { FarmInfoCard } from "@/components/farms/FarmInfoCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SectionTitle } from "@/components/SectionTitle";
import { StatusBanner } from "@/components/StatusBanner";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getAreasByFarmId } from "@/server/areas";
import { IFarm } from "@/server/models";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

export default function MyFarm() {
  const { farmId } = useGlobalSearchParams<{ farmId: string }>();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const farm = queryClient.getQueryData<IFarm>(
    queryKeys.farms.farmById(farmId),
  );

  const { data, isLoading, isRefetching, isError, error, refetch } =
    useAuthedQuery(queryKeys.areas.byFarmId(farmId), () =>
      getAreasByFarmId(token, farmId),
    );

  if (!farm || isLoading || isRefetching) return <LoadingScreen />;

  return (
    <View className="flex-1 gap-6">
      <View className="gap-3">
        <SectionTitle title="MyFarm" icon="flower" />
        <FarmInfoCard farm={farm} />
        <FarmBoundaryViewer boundaries={farm.boundaries} areaList={data} />
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

        {isError && (
          <StatusBanner
            theme="error"
            title="Something went wrong"
            description={error.message}
            action={{
              icon: "refresh",
              label: "Retry",
              onPress: () => refetch(),
            }}
          />
        )}

        {!isError &&
          (data?.length === 0 ? (
            <StatusBanner
              theme="warning"
              title="No areas defined yet"
              description="Areas you mark inside this farm will show up here."
            />
          ) : (
            <View className="gap-3">
              {data?.map((area) => (
                <AreaCard key={area.id} farmItem={area} />
              ))}
            </View>
          ))}
      </View>
    </View>
  );
}
