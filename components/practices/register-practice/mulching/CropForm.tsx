import { AppTextInput } from "@/components/shared/AppTextInput";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";
import type { RegisterPracticeInput } from "../schemas";

export const CropForm = ({
  control,
}: {
  control: Control<RegisterPracticeInput>;
}) => (
  <View className="gap-4">
    <Controller
      control={control}
      name="crop"
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <AppTextInput
          label="Crop"
          placeholder="e.g. Hemp"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          errorMessage={error?.message}
        />
      )}
    />
  </View>
);
