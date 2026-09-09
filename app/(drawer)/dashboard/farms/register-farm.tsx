import { AppButton } from "@/components/AppButton";
import { FarmLocationField } from "@/components/farms/FarmLocationField";
import { schema } from "@/components/farms/schemas";
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
