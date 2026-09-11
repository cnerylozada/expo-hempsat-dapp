import { AppButton } from "@/components/AppButton";
import { useAuthedMutation } from "@/components/authedRequests";
import { FarmBoundaryField } from "@/components/farms/FarmBoundaryField";
import { FarmLocationField } from "@/components/farms/FarmLocationField";
import { registerFarmSchema } from "@/components/farms/schemas";
import { TitleDeedPhotosField } from "@/components/farms/TitleDeedPhotosField";
import { MAX_PHOTOS } from "@/components/farms/utils";
import { StatusBanner } from "@/components/StatusBanner";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { usePhoto } from "@/providers/PhotoProvider";
import { createFarm } from "@/server/farms";
import { CreateFarmInput } from "@/server/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateFarm() {
  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { bottom } = useSafeAreaInsets();
  const { onSetParams, photoList, clearPhotoList } = usePhoto();

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
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-6"
      contentContainerStyle={{ paddingBottom: bottom }}
    >
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <FormControl isInvalid={!!errors.name}>
            <FormControlLabel>
              <FormControlLabelText>Farm name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="e.g. Green Valley Farm"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </Input>
            {errors.name && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.name.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        )}
      />

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
  );
}
