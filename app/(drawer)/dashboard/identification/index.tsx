import { useAuthedQuery } from "@/components/authedRequests";
import { IDCard } from "@/components/identification/IDCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyUser } from "@/server/users";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function IdentificationScreen() {
  const { token } = useAuth();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuthedQuery(queryKeys.users.myUser, () => getMyUser(token));

  if (isLoading || isRefetching) return <LoadingScreen />;

  if (!isLoading && !isError && !data?.inquiry_id) {
    return (
      <Redirect href={"/(drawer)/dashboard/identification/validate-id-card"} />
    );
  }

  return (
    <View className="flex-1 gap-6">
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
