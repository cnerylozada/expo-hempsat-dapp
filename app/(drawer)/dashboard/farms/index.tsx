import { useAuthedQuery } from "@/components/authedRequests";
import { FarmCard } from "@/components/farms/FarmCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyFarmList } from "@/server/farms";
import { Link } from "expo-router";
import { View } from "react-native";

export default function FarmsScreen() {
  const { token } = useAuth();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuthedQuery(queryKeys.farms.myFarms, () => getMyFarmList(token));

  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex-1 gap-6">
      <Link href={"/(drawer)/dashboard/farms/register-farm"} asChild>
        <ThemedButton title="Register new farm" iconName="add-circle" />
      </Link>

      <View className="gap-3">
        {isError && (
          <View className="gap-3">
            <ThemedText className="dark:text-text-danger-dark">
              Something went wrong: {error.message}
            </ThemedText>
            <ThemedButton
              title="Try again"
              iconName="refresh"
              loading={isRefetching}
              loadingTitle="Retrying..."
              onPress={() => refetch()}
            />
          </View>
        )}

        {!isError &&
          (data?.length === 0 ? (
            <ThemedText type="subtext">
              You have not registered any farms yet. Tap &quot;Register new
              farm&quot; to get started.
            </ThemedText>
          ) : (
            data?.map((farm) => (
              <Link
                key={farm.id}
                asChild
                href={`/(drawer)/dashboard/farms/${farm.id}`}
              >
                <FarmCard {...farm} />
              </Link>
            ))
          ))}
      </View>
    </View>
  );
}
