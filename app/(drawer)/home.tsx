import { ThemedText } from "@/components/themed-text";
import { Link } from "expo-router";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <ThemedText>Home !</ThemedText>
      <Link href={"/(tabs)"}>
        <ThemedText> Go to tabs!</ThemedText>
      </Link>
    </View>
  );
}
