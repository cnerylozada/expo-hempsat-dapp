import { formatDate } from "@/components/farms/utils";
import { FieldRow } from "@/components/shared/FieldRow";
import { Box } from "@/components/ui/box";
import { CROPS } from "@/server/models";
import { View } from "react-native";
import {
  AMOUNT_UNITS,
  COVERAGE_LEVELS,
  MATERIAL_SOURCES,
  MATERIAL_STATES,
  MULCH_MATERIALS,
} from "./models";
import type { RegisterPracticeInput } from "./schemas";

export const ReviewAndSignStep = ({
  values,
}: {
  values: RegisterPracticeInput;
}) => (
  <View className="gap-4">
    <Box className="gap-3 rounded-xl border border-border bg-card p-4">
      <FieldRow label="Crop" value={CROPS[values.crop]} />
      <FieldRow
        label="Planted"
        value={values.plantedAt ? formatDate(values.plantedAt) : "Not yet"}
      />
      <FieldRow label="Applied" value={formatDate(values.startedAt)} />
      <FieldRow
        label="Material"
        value={
          values.material === "other"
            ? values.materialOther
            : MULCH_MATERIALS[values.material]
        }
      />
      <FieldRow label="State" value={MATERIAL_STATES[values.materialState]} />
      <FieldRow
        label="Source"
        value={
          values.source === "brought_in"
            ? values.sourceDescription
            : MATERIAL_SOURCES[values.source]
        }
      />
      <FieldRow
        label="Amount"
        value={`${values.amount} ${AMOUNT_UNITS[values.unit]}`}
      />
      <FieldRow label="Coverage" value={COVERAGE_LEVELS[values.coverage]} />
      <FieldRow label="Photos" value={`${values.photoList.length}`} />
      <FieldRow label="Baseline" value={values.baseline} />
    </Box>
  </View>
);
