import { ScreenLayout } from "@/components/ScreenLayout";
import { StackHeaderLeft } from "@/components/StackHeaderLeft";
import { Stack } from "expo-router";

export default function IdenfificationLayout() {
  return (
    <Stack
      screenLayout={ScreenLayout}
      screenOptions={{
        headerLeft: (props) => <StackHeaderLeft {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My ID card" }} />
      <Stack.Screen
        name="validate-id-card"
        options={{ title: "Validate your ID card" }}
      />
    </Stack>
  );
}
