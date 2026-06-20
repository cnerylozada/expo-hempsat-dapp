import { ThemedText } from "@/components/ThemedText";
import { queryKeys } from "@/libs/queryKeys";
import { getMyUser } from "@/server/users";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import { IDCard } from "./_components/IDCard";

export default function IdentificationScreen() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.users.myUser,
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("jwt");
      return getMyUser(token);
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoading && !isError && !data?.inquiry_id) {
    return (
      <Redirect href={"/(drawer)/dashboard/identification/validate-id-card"} />
    );
  }

  return (
    <View className="flex-1 gap-4">
      {isError && (
        <ThemedText className="dark:text-text-danger-dark">
          Something went wrong: {error.message}
        </ThemedText>
      )}

      {!isError && data?.inquiry_id && (
        <IDCard
          name={data.first_name ?? ""}
          lastName={data.last_name ?? ""}
          idNumber={data.national_id ?? ""}
          imageUri={data.avatar_url ?? ""}
        />
      )}
    </View>
  );
}
