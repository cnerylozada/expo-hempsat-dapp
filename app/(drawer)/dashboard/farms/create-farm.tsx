import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { usePhoto } from "@/providers/PhotoProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const MAX_PHOTOS = 3;

const schema = z.object({
  photos: z
    .array(z.string())
    .min(1, "At least 1 photo is required")
    .max(MAX_PHOTOS, `At most ${MAX_PHOTOS} photos allowed`),
});

type FormValues = z.infer<typeof schema>;

export default function CreateFarm() {
  const router = useRouter();
  const { photoList, clearPhotoList } = usePhoto();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: { photos: [] },
  });

  console.log("photoList", photoList);

  useFocusEffect(
    useCallback(() => {
      if (photoList.length > 0) {
        const current = getValues("photos");
        const remaining = MAX_PHOTOS - current.length;
        const toAdd = photoList.slice(0, remaining);
        if (toAdd.length > 0) {
          setValue("photos", [...current, ...toAdd], { shouldValidate: true });
        }
        clearPhotoList();
      }
    }, [photoList]),
  );

  const removePhoto = (uri: string) => {
    setValue(
      "photos",
      getValues("photos").filter((_) => _ !== uri),
      { shouldValidate: true },
    );
  };

  const onSubmit = (data: FormValues) => {
    console.log("farm data:", data);
    reset();
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4">
      <View className="gap-2">
        <ThemedText type="defaultSemiBold">
          Upload photos of title deeds. At most {MAX_PHOTOS} photos
        </ThemedText>
        <Controller
          control={control}
          name="photos"
          render={({ field: { value } }) => (
            <View className="gap-4">
              {value.map((uri) => (
                <View key={uri} className="relative">
                  <Image source={{ uri }} className="w-full h-36 rounded-lg" />
                  <TouchableOpacity
                    onPress={() => removePhoto(uri)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full"
                  >
                    <Ionicons name="close-circle" size={30} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {value.length < MAX_PHOTOS && (
                <ThemedButton
                  onPress={() => router.push("/camera")}
                  title="Take a photo"
                  iconName="camera"
                />
              )}
            </View>
          )}
        />
        {errors.photos && (
          <ThemedText type="subtext">{errors.photos.message}</ThemedText>
        )}
      </View>

      <ThemedButton onPress={handleSubmit(onSubmit)} title="Save" />
    </ScrollView>
  );
}
