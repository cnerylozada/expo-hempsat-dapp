import { cropOptions } from "@/components/areas/register-area/models";
import { formatDate } from "@/components/farms/utils";
import { AppRadioGroup } from "@/components/shared/AppRadioGroup";
import { AppSelect } from "@/components/shared/AppSelect";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";
import type { RegisterPracticeInput } from "./schemas";

const PLANTED_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "Not yet" },
] as const;

export const CropForm = ({
  control,
}: {
  control: Control<RegisterPracticeInput>;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View className="gap-6">
      <Text className="text-muted-foreground">
        Mulching runs for one crop season. You&apos;ll close it at harvest.
      </Text>

      <Controller
        control={control}
        name="crop"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AppSelect
            label="What are you growing?"
            placeholder="Select a crop"
            options={cropOptions}
            value={value}
            onChange={onChange}
            errorMessage={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="plantedAt"
        render={({ field: { value, onChange } }) => (
          <View className="gap-6">
            <AppRadioGroup
              label="Is it planted yet?"
              columns={2}
              options={[...PLANTED_OPTIONS]}
              value={value === null ? "no" : "yes"}
              onChange={(answer) =>
                onChange(answer === "no" ? null : new Date())
              }
            />

            {value === null ? (
              <Text size="sm" className="text-muted-foreground">
                Not planted yet? You&apos;ll record the planting date in a
                check-in.
              </Text>
            ) : (
              <View className="items-start gap-2">
                <Text bold className="text-foreground">
                  Planting date
                </Text>
                <Pressable
                  onPress={() => setShowPicker(true)}
                  className="h-10 justify-center self-stretch rounded border border-border px-3"
                >
                  <Text className="text-foreground">{formatDate(value)}</Text>
                </Pressable>
                {/* The system's own date picker, the same component on both
                  platforms. */}
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
          </View>
        )}
      />
    </View>
  );
};
