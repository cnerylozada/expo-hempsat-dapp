import { AppButton } from "@/components/shared/AppButton";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Stepper } from "@/components/shared/Stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BaselineForm } from "./BaselineForm";
import { CropForm } from "./CropForm";
import { MaterialForm } from "./MaterialForm";
import { ReviewAndSignStep } from "./ReviewAndSignStep";
import { registerPracticeSchema, type RegisterPracticeInput } from "./schemas";

const STEPS = [
  "Your crop",
  "The mulch",
  "Since your baseline",
  "Review & sign",
];

const STEP_FIELDS: (keyof RegisterPracticeInput)[][] = [
  ["crop", "plantedAt"],
  [
    "startedAt",
    "material",
    "materialOther",
    "materialState",
    "source",
    "sourceDescription",
  ],
  ["baseline"],
  [],
];

export const RegisterMulchingForm = () => {
  const { bottom } = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  const { control, getValues, trigger, handleSubmit } =
    useForm<RegisterPracticeInput>({
      resolver: zodResolver(registerPracticeSchema),
      mode: "all",
      defaultValues: {
        plantedAt: new Date(),
        startedAt: new Date(),
        materialOther: "",
        sourceDescription: "",
        baseline: "",
      },
    });

  const goToStep = async (target: number) => {
    if (await trigger(STEP_FIELDS[step])) setStep(target);
  };

  const onSubmit = (data: RegisterPracticeInput) => {
    console.log(data);
  };

  return (
    <View className="flex-1 gap-6">
      <Stepper steps={STEPS} currentStep={step} onStepPress={goToStep} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        <SectionTitle title={STEPS[step]} />

        {step === 0 && <CropForm control={control} />}
        {step === 1 && <MaterialForm control={control} />}
        {step === 2 && <BaselineForm control={control} />}
        {isLast && <ReviewAndSignStep values={getValues()} />}
      </ScrollView>

      <View className="gap-3" style={{ paddingBottom: bottom }}>
        {isLast ? (
          <AppButton
            text="Sign and save"
            icon="wallet-outline"
            onPress={handleSubmit(onSubmit)}
          />
        ) : (
          <AppButton text="Next" onPress={() => goToStep(step + 1)} />
        )}
        {step > 0 && (
          <AppButton
            text="Back"
            theme="secondary"
            outline
            onPress={() => goToStep(step - 1)}
          />
        )}
      </View>
    </View>
  );
};
