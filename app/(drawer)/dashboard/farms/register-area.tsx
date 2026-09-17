import { AppButton } from "@/components/AppButton";
import { AreaBoundaryField } from "@/components/areas/AreaBoundaryField";
import { registerAreaSchema } from "@/components/areas/schemas";
import { useAuthedMutation } from "@/components/authedRequests";
import { ScreenLayout } from "@/components/ScreenLayout";
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
import { addNewAreaInFarm } from "@/server/areas";
import { CreateAreaInput } from "@/server/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";

export default function RegisterAreaForm() {
  const { farmId } = useLocalSearchParams<{ farmId: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateAreaInput>({
    resolver: zodResolver(registerAreaSchema),
    mode: "all",
    defaultValues: { name: "", description: "", boundaries: [] },
  });

  const mutation = useAuthedMutation({
    mutationFn: (data: CreateAreaInput) =>
      addNewAreaInFarm(token, farmId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.areas.byFarmId(farmId),
      });
      reset();
      // `[farmId]` is already on the stack (this screen was pushed from it) —
      // dismissTo pops back to that existing entry instead of `replace`,
      // which would push a second copy on top of it.
      router.dismissTo(`/(drawer)/dashboard/farms/${farmId}`);
    },
  });

  const onSubmit = (data: CreateAreaInput) => {
    mutation.mutate(data);
  };

  return (
    <ScreenLayout>
      <ScrollView className="flex-1" contentContainerClassName="gap-6">
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl isInvalid={!!errors.name}>
              <FormControlLabel>
                <FormControlLabelText>Area name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="e.g. North paddock"
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

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormControl isInvalid={!!errors.description}>
              <FormControlLabel>
                <FormControlLabelText>Description</FormControlLabelText>
              </FormControlLabel>
              <Input className="h-24 items-start py-2">
                <InputField
                  placeholder="What makes this area distinct — crop, soil, irrigation zone..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  textAlignVertical="top"
                />
              </Input>
              {errors.description && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.description.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
        />

        <AreaBoundaryField
          value={getValues("boundaries")}
          onChange={(boundaries) =>
            setValue("boundaries", boundaries, { shouldValidate: true })
          }
          errorMessage={errors.boundaries?.message}
          farmId={farmId}
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
