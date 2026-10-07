import { StackHeaderLeft } from "@/components/StackHeaderLeft";
import { Stack } from "expo-router";

export default function PracticesLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: (props) => <StackHeaderLeft {...props} />,
      }}
    >
      <Stack.Screen
        name="register-summary"
        options={{ title: "Register summary" }}
      />
      <Stack.Screen
        name="register-practice"
        options={{ title: "Register your practice" }}
      />
      <Stack.Screen name="[practiceId]" />
    </Stack>
  );
}
