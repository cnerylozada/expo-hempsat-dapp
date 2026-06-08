import { ThemedText } from "@/components/ThemedText";
import { Image, View } from "react-native";

type IDCardProps = {
  imageUri: string;
  name: string;
  lastName: string;
  idNumber: string;
};

export const IDCard = ({ imageUri, name, lastName, idNumber }: IDCardProps) => {
  return (
    <View className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <View className="h-2 bg-[#3366aa]" />
      <View className="flex-row items-center gap-4 p-4">
        <Image
          source={{ uri: imageUri }}
          style={{ width: 100 }}
          className="h-full w-24 rounded-md"
          resizeMode="cover"
        />
        <View className="flex-1 gap-0.5">
          <ThemedText type="subtext">ID Number</ThemedText>
          <ThemedText type="defaultSemiBold">{idNumber}</ThemedText>
          <ThemedText type="subtext">Names</ThemedText>
          <ThemedText type="defaultSemiBold">{name}</ThemedText>
          <ThemedText type="subtext">Surnames</ThemedText>
          <ThemedText type="defaultSemiBold">{lastName}</ThemedText>
        </View>
      </View>
    </View>
  );
};
