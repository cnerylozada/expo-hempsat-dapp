import { IDCard } from "@/components/identification/IDCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ThemedText } from "@/components/ThemedText";
import { useAuthedQuery } from "@/components/authedRequests";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyUser } from "@/server/users";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function IdentificationScreen() {
  const { token } = useAuth();

  const { data, isLoading, isError, error } = useAuthedQuery(
    queryKeys.users.myUser,
    () => getMyUser(token),
  );

  if (isLoading) {
    return <LoadingScreen />;
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
