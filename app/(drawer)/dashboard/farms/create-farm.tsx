import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { usePhoto } from "@/providers/PhotoProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const MAX_PHOTOS = 3;
const photoSchema = z
  .object({
    uri: z.string(),
    fileSizeInMB: z
      .number()
      .min(0.05, "File too small (min 50KB)")
      .max(5, "File too large (max 5MB)"),
    width: z.number(),
    height: z.number(),
  })
  .refine((_) => _.width >= 600 && _.height >= 900, {
    message: "Too small (min 600×900px)",
  });

const schema = z.object({
  titleDeedPhotoList: z
    .array(photoSchema)
    .min(1, "At least 1 photo is required")
    .max(MAX_PHOTOS, `At most ${MAX_PHOTOS} photos allowed`),
});

type FormValues = z.infer<typeof schema>;

export default function CreateFarm() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { onSetParams, photoList, clearPhotoList } = usePhoto();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: { titleDeedPhotoList: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "titleDeedPhotoList",
  });

  useEffect(() => {
    onSetParams({ max_files: MAX_PHOTOS });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (photoList.length > 0) {
        const remaining = MAX_PHOTOS - getValues("titleDeedPhotoList").length;
        photoList.slice(0, remaining).forEach((photo) => append(photo));
        clearPhotoList();
      }
    }, [photoList]),
  );

  const onSubmit = (data: FormValues) => {
    console.log("farm data:", data);
    reset();
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-4"
      contentContainerStyle={{ paddingBottom: bottom || 16 }}
    >
      <View className="gap-2">
        <ThemedText type="defaultSemiBold">
          Upload photos of title deeds
        </ThemedText>
        <View>
          <ThemedText type="subtext">• 1 to {MAX_PHOTOS} photos</ThemedText>
          <ThemedText type="subtext">• JPG or PNG only</ThemedText>
          <ThemedText type="subtext">• Size: 50 KB – 5 MB</ThemedText>
          <ThemedText type="subtext">• Min. dimensions: 600×900 px</ThemedText>
        </View>
        <Controller
          control={control}
          name="titleDeedPhotoList"
          render={() => (
            <View className="gap-4">
              {fields.map((field, index) => {
                const itemError = errors.titleDeedPhotoList?.[index];
                const errorMessages = [
                  itemError?.message,
                  itemError?.fileSizeInMB?.message,
                ].filter(Boolean);

                return (
                  <View key={field.id} className="gap-1">
                    <ThemedText type="subtext">
                      {field.width}×{field.height}px ·{" "}
                      {field.fileSizeInMB.toFixed(3)} MB
                    </ThemedText>
                    <View className="relative">
                      <Image
                        source={{ uri: field.uri }}
                        className="w-full h-44 rounded-lg"
                      />
                      <TouchableOpacity
                        onPress={() => remove(index)}
                        className="absolute top-1 right-1 bg-black/50 rounded-full"
                      >
                        <Ionicons name="close-circle" size={30} color="white" />
                      </TouchableOpacity>
                    </View>
                    {errorMessages.map((_) => (
                      <ThemedText
                        key={_}
                        type="subtext"
                        className="text-text-danger dark:text-text-danger-dark"
                      >
                        {_}
                      </ThemedText>
                    ))}
                  </View>
                );
              })}
              {fields.length < MAX_PHOTOS && (
                <ThemedButton
                  onPress={() => router.push("/camera")}
                  title="Take a photo"
                  iconName="camera"
                />
              )}
            </View>
          )}
        />
        {errors?.titleDeedPhotoList?.message && (
          <ThemedText
            type="subtext"
            className="text-text-danger dark:text-text-danger-dark"
          >
            {errors.titleDeedPhotoList.message}
          </ThemedText>
        )}
      </View>

      <ThemedButton onPress={handleSubmit(onSubmit)} title="Save" />
    </ScrollView>
  );
}
