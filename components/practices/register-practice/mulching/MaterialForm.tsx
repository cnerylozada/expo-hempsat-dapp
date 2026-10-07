import { formatDate } from "@/components/farms/utils";
import { AppRadioGroup } from "@/components/shared/AppRadioGroup";
import { AppTextInput } from "@/components/shared/AppTextInput";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";
import {
  materialOptions,
  materialSourceOptions,
  materialStateOptions,
} from "./models";
import type { RegisterPracticeInput } from "./schemas";

export const MaterialForm = ({
  control,
}: {
  control: Control<RegisterPracticeInput>;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View className="gap-6">
      <Controller
        control={control}
        name="startedAt"
        render={({ field: { value, onChange } }) => (
          <View className="items-start gap-2">
            <Text bold className="text-foreground">
              Date applied
            </Text>
            <Pressable
              onPress={() => setShowPicker(true)}
              className="h-10 justify-center self-stretch rounded border border-border px-3"
            >
              <Text className="text-foreground">{formatDate(value)}</Text>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={value}
                mode="date"
                maximumDate={new Date()}
                onChange={(_, date) => {
                  setShowPicker(false);
                  if (date) onChange(date);
                }}
              />
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="material"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View className="gap-6">
            <AppRadioGroup
              label="Material"
              options={materialOptions}
              columns={2}
              value={value}
              onChange={onChange}
              errorMessage={error?.message}
            />

            {value === "other" && (
              <Controller
                control={control}
                name="materialOther"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <AppTextInput
                    label="What was it?"
                    placeholder="e.g. Wood chips"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={error?.message}
                  />
                )}
              />
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="materialState"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AppRadioGroup
            label="Fresh or dry?"
            description="Fresh material is mostly water."
            options={materialStateOptions}
            columns={2}
            value={value}
            onChange={onChange}
            errorMessage={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="source"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View className="gap-6">
            <AppRadioGroup
              label="Where did it come from?"
              options={materialSourceOptions}
              columns={2}
              value={value}
              onChange={onChange}
              errorMessage={error?.message}
            />

            {value === "brought_in" && (
              <Controller
                control={control}
                name="sourceDescription"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <AppTextInput
                    label="Where from?"
                    placeholder="e.g. Neighbor's farm, 2 km away"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={error?.message}
                  />
                )}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};
