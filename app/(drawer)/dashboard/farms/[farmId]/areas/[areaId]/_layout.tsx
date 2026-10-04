import { StackHeaderLeft } from "@/components/StackHeaderLeft";
import { Stack } from "expo-router";

export default function AreaLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: (props) => <StackHeaderLeft {...props} />,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ title: "Area" }} />
      <Stack.Screen
        name="practices"
        // The nested practices Stack draws its own header.
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
