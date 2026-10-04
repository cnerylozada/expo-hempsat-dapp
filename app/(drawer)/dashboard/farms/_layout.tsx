import { StackHeaderLeft } from "@/components/StackHeaderLeft";
import { Stack } from "expo-router";

export default function FarmsLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: (props) => <StackHeaderLeft {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My farms" }} />
      <Stack.Screen
        name="register-farm"
        options={{ title: "Register your farm" }}
      />
      <Stack.Screen name="[farmId]/(tabs)" />
      <Stack.Screen
        name="[farmId]/areas"
        // The nested areas Stack draws its own header.
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
