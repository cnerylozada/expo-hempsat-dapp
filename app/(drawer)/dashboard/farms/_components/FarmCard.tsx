import { ThemedText } from "@/components/ThemedText";
import { IFarm } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";

type FarmCardProps = Pick<
  IFarm,
  "country" | "location" | "latitude" | "longitude"
>;

export const FarmCard = ({
  country,
  location,
  latitude,
  longitude,
}: FarmCardProps) => {
  return (
    <View className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <View className="h-2 bg-tint" />
      <View className="flex-row items-center gap-4 p-4">
        <View className="bg-tint/10 rounded-full p-3">
          <Ionicons name="leaf-outline" size={28} color="#3366aa" />
        </View>
        <View className="flex-1">
          <ThemedText type="defaultSemiBold">{location}</ThemedText>
          <ThemedText type="subtext">{country}</ThemedText>
          <ThemedText type="subtext">
            {latitude.toFixed(3)}, {longitude.toFixed(3)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};
