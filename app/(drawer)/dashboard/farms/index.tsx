import { AppButton } from "@/components/AppButton";
import { useAuthedQuery } from "@/components/authedRequests";
import { FarmCard } from "@/components/farms/FarmCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyFarmList } from "@/server/farms";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FarmsScreen() {
  const { token } = useAuth();
  const { bottom } = useSafeAreaInsets();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuthedQuery(queryKeys.farms.myFarms, () => getMyFarmList(token));

  if (isLoading || isRefetching) return <LoadingScreen />;

  return (
    <View className="flex-1 gap-6">
      <Link href={"/(drawer)/dashboard/farms/register-farm"} asChild>
        <AppButton text="Register new farm" icon="add-circle-outline" />
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
            title="No farms registered yet"
            description='Tap "Register new farm" above to add your first one.'
          />
        ) : (
          <FlatList
            className="flex-1"
            contentContainerClassName="gap-6"
            contentContainerStyle={{ paddingBottom: bottom }}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link
                key={item.id}
                asChild
                href={`/(drawer)/dashboard/farms/${item.id}`}
              >
                <FarmCard {...item} />
              </Link>
            )}
          />
        ))}
    </View>
  );
}
