import { useAuthedMutation } from "@/components/authedRequests";
import { FarmBoundaryField } from "@/components/farms/register-farm/FarmBoundaryField";
import { FarmLocationField } from "@/components/farms/register-farm/FarmLocationField";
import {
  MAX_TITLE_DEED_PHOTOS,
  registerFarmSchema,
} from "@/components/farms/register-farm/schemas";
import { ScreenLayout } from "@/components/ScreenLayout";
import { AppButton } from "@/components/shared/AppButton";
import { AppTextInput } from "@/components/shared/AppTextInput";
import { PhotoListField } from "@/components/shared/PhotoListField";
import { StatusBanner } from "@/components/shared/StatusBanner";
import { useCameraPhotos } from "@/components/shared/useCameraPhotos";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { usePhoto } from "@/providers/PhotoProvider";
import { createFarm } from "@/server/farms";
import { CreateFarmInput } from "@/server/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateFarm() {
  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { bottom } = useSafeAreaInsets();
  const { clearPhotoList } = usePhoto();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateFarmInput>({
    resolver: zodResolver(registerFarmSchema),
    mode: "all",
    defaultValues: {
      name: "",
      titleDeedPhotoList: [],
      location: undefined,
      boundaries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "titleDeedPhotoList",
  });

  useCameraPhotos({
    maxPhotos: MAX_TITLE_DEED_PHOTOS,
    getPhotoCount: () => getValues("titleDeedPhotoList").length,
    onAddPhotos: append,
  });

  const mutation = useAuthedMutation({
    mutationFn: (data: CreateFarmInput) => createFarm(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.farms.myFarms });
      reset();
      clearPhotoList();
      router.replace("/(drawer)/dashboard/farms");
    },
  });

  const onSubmit = (data: CreateFarmInput) => {
    mutation.mutate(data);
  };

  return (
    <ScreenLayout>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6"
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Farm name"
              placeholder="e.g. Green Valley Farm"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <PhotoListField
          label="Upload photos of title deeds"
          photos={fields}
          maxPhotos={MAX_TITLE_DEED_PHOTOS}
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

        <FarmBoundaryField
          value={getValues("boundaries")}
          onChange={(boundaries) =>
            setValue("boundaries", boundaries, { shouldValidate: true })
          }
          errorMessage={errors.boundaries?.message}
        />

        {mutation.isError && (
          <StatusBanner
            theme="error"
            title="Something went wrong"
            description={mutation.error.message}
          />
        )}

        <AppButton
          text="Save"
          icon="save-outline"
          onPress={handleSubmit(onSubmit)}
          loading={mutation.isPending}
        />
      </ScrollView>
    </ScreenLayout>
  );
}
