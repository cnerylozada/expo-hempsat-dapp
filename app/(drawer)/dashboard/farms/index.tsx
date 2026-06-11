import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { usePhoto } from "@/providers/PhotoProvider";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, View } from "react-native";

export default function FarmsScreen() {
  const router = useRouter();
  const { photoUri, setPhotoUri } = usePhoto();

  const [photoList, setPhotoList] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (photoUri) {
        setPhotoList((prev) => [...prev, photoUri]);
        setPhotoUri(null);
      }
    }, [photoUri]),
  );

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

      {!!photoList.length &&
        photoList.map((_) => (
          <View key={_}>
            <Image source={{ uri: _ }} className="w-16 h-16" />
          </View>
        ))}
    </View>
  );
}
