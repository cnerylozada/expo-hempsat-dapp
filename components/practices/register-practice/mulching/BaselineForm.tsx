import { AppTextInput } from "@/components/shared/AppTextInput";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";
import type { RegisterPracticeInput } from "../schemas";

export const BaselineForm = ({
  control,
}: {
  control: Control<RegisterPracticeInput>;
}) => (
  <View className="gap-4">
    <Controller
      control={control}
      name="baseline"
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <AppTextInput
          label="Baseline"
          placeholder="e.g. No-till since 2024"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          errorMessage={error?.message}
        />
      )}
    />
  </View>
);
