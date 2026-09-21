import { ScreenLayout } from "@/components/ScreenLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function Layout() {
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
