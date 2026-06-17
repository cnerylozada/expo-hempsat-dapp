import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { usePhoto } from "@/providers/PhotoProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";
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
  location: z.object(
    {
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    },
    { message: "Location is required" },
  ),
});

type FormValues = z.infer<typeof schema>;

export default function CreateFarm() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { onSetParams, photoList, clearPhotoList } = usePhoto();
  const [placeName, setPlaceName] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      titleDeedPhotoList: [],
      location: undefined,
    },
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
    setPlaceName(null);
    clearPhotoList();
  };

  const applyLocation = async (coords: {
    latitude: number;
    longitude: number;
  }) => {
    setValue("location", coords, { shouldValidate: true });

    const [address] = await Location.reverseGeocodeAsync(coords);
    setPlaceName(
      address
        ? [address.city, address.country].filter(Boolean).join(", ")
        : null,
    );
  };

  const onSharePosition = async () => {
    const { status: currentStatus } =
      await Location.getForegroundPermissionsAsync();

    if (currentStatus === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      await applyLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      return;
    }

    if (currentStatus === "denied") {
      Alert.alert(
        "Location access denied",
        "Please enable location access in your device settings to share your position.",
      );
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location access denied",
        "Please enable location access in your device settings to share your position.",
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    await applyLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-6"
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

      <View className="gap-2">
        <ThemedText type="defaultSemiBold">
          Confirm you are at the farm
        </ThemedText>
        <View>
          <ThemedText type="subtext">
            • Stand at the center of your farm before sharing your position
          </ThemedText>
          <ThemedText type="subtext">
            • Your position must be within 20m of the location in your photos
          </ThemedText>
        </View>
        <View>
          <ThemedButton
            title="Share position"
            iconName="map"
            onPress={onSharePosition}
          />
        </View>
        <View>
          {getValues("location") && (
            <ThemedText>
              Latitude: {getValues("location").latitude} Longitud:{" "}
              {getValues("location").longitude}
            </ThemedText>
          )}
          {placeName && <ThemedText>{placeName}</ThemedText>}
        </View>

        {errors.location?.message && (
          <ThemedText
            type="subtext"
            className="text-text-danger dark:text-text-danger-dark"
          >
            {errors.location.message}
          </ThemedText>
        )}
      </View>

      <ThemedButton onPress={handleSubmit(onSubmit)} title="Save" />
    </ScrollView>
  );
}
