import { ScreenLayout } from "@/components/ScreenLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function AreaLayout() {
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
          title: "My Area",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="leaf-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="practices"
        options={{
          title: "Practices",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="list-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
