import { ThemedText } from "@/components/ThemedText";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <ThemedText type="title">Read onchain data</ThemedText>
      </View>
      <SocialSection />
    </ScrollView>
  );
}

function SocialSection() {
  return (
    <View style={{ gap: 2 }}>
      <ThemedText type="subtitle">{`useSocialProfiles()`}</ThemedText>
      <ThemedText type="subtext">
        Fetch all known social profiles for any wallet address.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
});
