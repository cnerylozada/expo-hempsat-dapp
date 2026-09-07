import { AppButton } from "@/components/AppButton";
import { FarmLocationField } from "@/components/farms/FarmLocationField";
import {
  MAX_PHOTOS,
  TitleDeedPhotosField,
} from "@/components/farms/TitleDeedPhotosField";
import { Text } from "@/components/ui/text";
import { queryKeys } from "@/libs/queryKeys";
import { usePhoto } from "@/providers/PhotoProvider";
import { createFarm } from "@/server/farms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

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

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid },
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

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-6"
      contentContainerStyle={{ paddingBottom: bottom }}
    >
      <TitleDeedPhotosField
        photos={fields}
        errors={errors.titleDeedPhotoList}
        onRemovePhoto={remove}
      />

      <FarmLocationField
        value={getValues("location")}
        onChange={(coords) =>
          setValue("location", coords, { shouldValidate: true })
        }
        errorMessage={errors.location?.message}
      />

      {mutation.isError && (
        <Text className="dark:text-text-danger-dark">
          Something went wrong: {mutation.error.message}
        </Text>
      )}

      <AppButton
        text="Save"
        icon="save-outline"
        onPress={handleSubmit(onSubmit)}
        loading={mutation.isPending}
        disabled={!isValid}
      />
    </ScrollView>
  );
}
