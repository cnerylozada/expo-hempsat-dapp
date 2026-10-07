import { FieldRow } from "@/components/shared/FieldRow";
import { Box } from "@/components/ui/box";
import { View } from "react-native";
import type { RegisterPracticeInput } from "../schemas";

export const ReviewAndSignStep = ({
  values,
}: {
  values: RegisterPracticeInput;
}) => (
  <View className="gap-4">
    <Box className="gap-3 rounded-xl border border-border bg-card p-4">
      <FieldRow label="Crop" value={values.crop} />
      <FieldRow label="Mulch" value={values.mulch} />
      <FieldRow label="Baseline" value={values.baseline} />
    </Box>
  </View>
);
