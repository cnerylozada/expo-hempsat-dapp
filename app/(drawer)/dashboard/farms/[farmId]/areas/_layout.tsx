import { StackHeaderLeft } from "@/components/StackHeaderLeft";
import { Stack } from "expo-router";

export default function AreasLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: (props) => <StackHeaderLeft {...props} />,
      }}
    >
      <Stack.Screen name="new" options={{ title: "Register your area" }} />
      <Stack.Screen
        name="[areaId]"
        // The nested area Stack draws its own header.
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
