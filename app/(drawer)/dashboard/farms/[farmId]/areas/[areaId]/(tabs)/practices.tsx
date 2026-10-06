import { useAuthedQuery } from "@/components/authedRequests";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PracticeCard } from "@/components/practices/PracticeCard";
import { AppButton } from "@/components/shared/AppButton";
import { StatusBanner } from "@/components/shared/StatusBanner";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getPracticesByAreaId } from "@/server/practices";
import { Link, useGlobalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AreaPractices() {
  const { farmId, areaId } = useGlobalSearchParams<{
    farmId: string;
    areaId: string;
  }>();

  const { token } = useAuth();
  const { bottom } = useSafeAreaInsets();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuthedQuery(queryKeys.practices.byAreaId(areaId), () =>
      getPracticesByAreaId(token, areaId),
    );

  if (isLoading || isRefetching) return <LoadingScreen />;

  return (
    <View className="flex-1 gap-6">
      <Link
        href={{
          pathname:
            "/(drawer)/dashboard/farms/[farmId]/areas/[areaId]/practices/register-summary",
          params: { farmId, areaId },
        }}
        asChild
      >
        <AppButton text="Start a new practice" icon="add-circle-outline" />
      </Link>

      {isError && (
        <StatusBanner
          theme="error"
          title="Something went wrong"
          description={error.message}
          action={{
            icon: "refresh",
            label: isRefetching ? "Retrying..." : "Retry",
            onPress: () => refetch(),
          }}
        />
      )}

      {!isError &&
        (data?.length === 0 ? (
          <StatusBanner
            theme="warning"
            title="No practices yet"
            description='Tap "Start a new practice" above to begin the first one.'
          />
        ) : (
          <FlatList
            className="flex-1"
            contentContainerClassName="gap-6"
            contentContainerStyle={{ paddingBottom: bottom }}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PracticeCard practiceSummary={item} onPress={() => {}} />
            )}
          />
        ))}
    </View>
  );
}
