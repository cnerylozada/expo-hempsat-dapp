import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function FarmsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ThemedText>FarmsScreen</ThemedText>
      <ThemedButton
        onPress={() => {
          router.push("/camera");
        }}
        title="Take a photo"
        iconName="camera"
      />
    </View>
  );
}
