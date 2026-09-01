import { LoadingScreen } from "@/components/LoadingScreen";
import { ThemedText } from "@/components/ThemedText";
import { useAuthedQuery } from "@/components/authedRequests";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyFarmById } from "@/server/farms";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Layout() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { token } = useAuth();

  const { data, isLoading, isError, error } = useAuthedQuery(
    queryKeys.farms.farmById(id),
    () => getMyFarmById(token, id),
  );

  useEffect(() => {
    if (data?.location) {
      navigation.setOptions({ title: data.location });
    }
  }, [data?.location, navigation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <View className="flex-1">
        <ThemedText className="dark:text-text-danger-dark">
          Something went wrong: {error.message}
        </ThemedText>
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
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
