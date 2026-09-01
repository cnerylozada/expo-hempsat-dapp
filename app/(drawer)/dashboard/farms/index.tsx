import { FarmCard } from "@/components/farms/FarmCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyFarmList } from "@/server/farms";
import { TokenExpiredError } from "@/server/http";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { View } from "react-native";

export default function FarmsScreen() {
  const { onSignOut } = useAuth();

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: queryKeys.farms.myFarms,
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("jwt");
      try {
        return await getMyFarmList(token);
      } catch (error) {
        if (error instanceof TokenExpiredError) await onSignOut();
        throw error;
      }
    },
  });

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
