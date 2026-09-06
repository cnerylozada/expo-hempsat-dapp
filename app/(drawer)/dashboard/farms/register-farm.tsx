import { AppButton } from "@/components/AppButton";
import { InstructionsCard } from "@/components/InstructionsCard";
import { StatusBanner } from "@/components/StatusBanner";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { queryKeys } from "@/libs/queryKeys";
import { usePhoto } from "@/providers/PhotoProvider";
import { createFarm } from "@/server/farms";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { cssInterop } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

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
  const queryClient = useQueryClient();
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

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const token = await SecureStore.getItemAsync("jwt");
      return createFarm(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.farms.myFarms });
      reset();
      setPlaceName(null);
      clearPhotoList();
      router.replace("/(drawer)/dashboard/farms");
    },
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
    mutation.mutate(data);
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
      contentContainerStyle={{ paddingBottom: bottom }}
    >
      <View className="gap-3">
        <InstructionsCard
          title="Upload photos of title deeds"
          icon="images-outline"
          items={[
            `1 to ${MAX_PHOTOS} photos`,
            "JPG or PNG only",
            "Size: 50 KB – 5 MB",
            "Min. dimensions: 600×900 px",
          ]}
        />
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
                  <View key={field.id} className="gap-2">
                    <View className="flex-row gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Ionicons
                          name="resize-outline"
                          size={12}
                          className="text-foreground"
                        />
                        <BadgeText>
                          {field.width}×{field.height}px
                        </BadgeText>
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Ionicons
                          name="document-outline"
                          size={12}
                          className="text-foreground"
                        />
                        <BadgeText>
                          {field.fileSizeInMB.toFixed(3)} MB
                        </BadgeText>
                      </Badge>
                    </View>
                    {errorMessages.map((_) => (
                      <Text key={_} className="text-destructive">
                        {_}
                      </Text>
                    ))}
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
                  </View>
                );
              })}
              {fields.length < MAX_PHOTOS && (
                <AppButton
                  text="Take a photo"
                  icon="camera-outline"
                  onPress={() => router.push("/camera")}
                />
              )}
            </View>
          )}
        />
        {errors?.titleDeedPhotoList?.message && (
          <Text className="text-destructive">
            {errors.titleDeedPhotoList.message}
          </Text>
        )}
      </View>

      <View className="gap-3">
        <InstructionsCard
          title="Confirm you are at the farm"
          icon="location-outline"
          items={[
            "Stand at the center of your farm before sharing your position",
            "Your position must be within 20m of the location in your photos",
          ]}
        />

        {getValues("location") && (
          <StatusBanner
            theme="success"
            title={placeName ?? "Position shared"}
            description={`Latitude: ${getValues("location").latitude.toFixed(5)}, Longitude: ${getValues("location").longitude.toFixed(5)}`}
          />
        )}

        <AppButton
          text="Share position"
          icon="locate-outline"
          onPress={onSharePosition}
        />

        {errors.location?.message && (
          <Text className="text-destructive">{errors.location.message}</Text>
        )}
      </View>

      {mutation.isError && (
        <Text className="dark:text-text-danger-dark">
          Something went wrong: {mutation.error.message}
        </Text>
      )}

      {/* <ThemedButton
        onPress={handleSubmit(onSubmit)}
        title="Save"
        loading={mutation.isPending}
        loadingTitle="Saving farm..."
      /> */}

      <Button onPress={handleSubmit(onSubmit)}>
        <ButtonText>Save</ButtonText>
      </Button>
    </ScrollView>
  );
}
