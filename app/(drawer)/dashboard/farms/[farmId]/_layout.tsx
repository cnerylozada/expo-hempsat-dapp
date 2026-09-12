import { LoadingScreen } from "@/components/LoadingScreen";
import { ScreenLayout } from "@/components/ScreenLayout";
import { StatusBanner } from "@/components/StatusBanner";
import { useAuthedQuery } from "@/components/authedRequests";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyFarmById } from "@/server/farms";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function Layout() {
  const { farmId } = useGlobalSearchParams<{ farmId: string }>();
  const navigation = useNavigation();

  const { token } = useAuth();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuthedQuery(queryKeys.farms.farmById(farmId), () =>
      getMyFarmById(token, farmId),
    );

  useEffect(() => {
    if (data?.name) {
      navigation.setOptions({ title: data.name });
    }
  }, [data?.name, navigation]);

  if (isLoading || isRefetching) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <ScreenLayout>
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
      </ScreenLayout>
    );
  }

  return (
    <Tabs
      screenLayout={ScreenLayout}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Farm",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="flower-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="conditions"
        options={{
          title: "Conditions",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="cloud" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
