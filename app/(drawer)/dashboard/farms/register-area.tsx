import { AppButton } from "@/components/AppButton";
import { AppRadioGroup } from "@/components/AppRadioGroup";
import { AppSelect } from "@/components/AppSelect";
import { AppTextInput } from "@/components/AppTextInput";
import { AreaBoundaryField } from "@/components/areas/AreaBoundaryField";
import {
  cropOptions,
  registerAreaSchema,
  tillagePracticeOptions,
} from "@/components/areas/schemas";
import { TimeUnderPracticeField } from "@/components/areas/TimeUnderPracticeField";
import { useAuthedMutation, useAuthedQuery } from "@/components/authedRequests";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScreenLayout } from "@/components/ScreenLayout";
import { StatusBanner } from "@/components/StatusBanner";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { addNewAreaInFarm, getAreasByFarmId } from "@/server/areas";
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
    data: existingAreaList,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useAuthedQuery(queryKeys.areas.byFarmId(farmId), () =>
    getAreasByFarmId(token, farmId),
  );

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

  if (isLoading || isRefetching) return <LoadingScreen />;

  if (isError)
    return (
      <ScreenLayout>
        <StatusBanner
          theme="error"
          title="Something went wrong"
          description={error.message}
          action={{
            icon: "refresh",
            label: "Retry",
            onPress: () => refetch(),
          }}
        />
      </ScreenLayout>
    );

  return (
    <ScreenLayout>
      <ScrollView className="flex-1" contentContainerClassName="gap-6">
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Area name"
              placeholder="e.g. North paddock"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Description"
              placeholder="What makes this area distinct — crop, soil, irrigation zone..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.description?.message}
              multiline
            />
          )}
        />

        <Controller
          control={control}
          name="tillagePractice"
          render={({ field: { value, onChange } }) => (
            <AppRadioGroup
              label="Current tillage practice"
              description="This sets which regenerative actions this area is eligible to start tracking."
              options={tillagePracticeOptions}
              value={value}
              onChange={onChange}
              errorMessage={errors.tillagePractice?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="currentCrop"
          render={({ field: { value, onChange } }) => (
            <AppSelect
              label="Current / most recent crop"
              description="What is growing now, or what was last harvested here."
              placeholder="Select a crop"
              options={cropOptions}
              value={value}
              onChange={onChange}
              errorMessage={errors.currentCrop?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="yearsUnderPractice"
          render={({ field: yearsField }) => (
            <Controller
              control={control}
              name="monthsUnderPractice"
              render={({ field: monthsField }) => (
                <TimeUnderPracticeField
                  yearsValue={yearsField.value}
                  monthsValue={monthsField.value}
                  onChangeYears={yearsField.onChange}
                  onChangeMonths={monthsField.onChange}
                  yearsErrorMessage={errors.yearsUnderPractice?.message}
                  monthsErrorMessage={errors.monthsUnderPractice?.message}
                />
              )}
            />
          )}
        />

        {!isError && existingAreaList && (
          <AreaBoundaryField
            value={getValues("boundaries")}
            onChange={(boundaries) =>
              setValue("boundaries", boundaries, { shouldValidate: true })
            }
            errorMessage={errors.boundaries?.message}
            farmId={farmId}
            existingAreaList={existingAreaList}
          />
        )}

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
