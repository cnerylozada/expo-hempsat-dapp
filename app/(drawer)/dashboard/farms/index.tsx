import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { View } from "react-native";

export default function FarmsScreen() {
  return (
    <View className="flex-1">
      <ThemedText>FarmsScreen</ThemedText>

      <Link asChild href={"/(drawer)/dashboard/farms/create-farm"}>
        <ThemedButton title="Register new farm" iconName="add-circle" />
      </Link>
    </View>
  );
}
