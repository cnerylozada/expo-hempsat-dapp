import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { queryKeys } from "@/libs/queryKeys";
import { getMyFarms } from "@/server/farms";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import { FarmCard } from "./_components/FarmCard";

export default function FarmsScreen() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.farms.myFarms,
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("jwt");
      return getMyFarms(token);
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 gap-6">
      <Link href={"/(drawer)/dashboard/farms/create-farm"} asChild>
        <ThemedButton title="Register new farm" iconName="add-circle" />
      </Link>

      <View className="gap-3">
        {isError && (
          <View>
            <ThemedText className="dark:text-text-danger-dark">
              Something went wrong: {error.message}
            </ThemedText>
          </View>
        )}

        {!isError &&
          (data?.length === 0 ? (
            <ThemedText type="subtext">
              You have not registered any farms yet. Tap &quot;Register new
              farm&quot; to get started.
            </ThemedText>
          ) : (
            data?.map((farm) => <FarmCard key={farm.id} {...farm} />)
          ))}
      </View>
    </View>
  );
}
