import { AppNumberInput } from "@/components/AppNumberInput";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export type TimeUnderPracticeFieldProps = {
  yearsValue: number | undefined;
  monthsValue: number | undefined;
  onChangeYears: (years: number | undefined) => void;
  onChangeMonths: (months: number | undefined) => void;
  yearsErrorMessage?: string;
  monthsErrorMessage?: string;
};

export function TimeUnderPracticeField({
  yearsValue,
  monthsValue,
  onChangeYears,
  onChangeMonths,
  yearsErrorMessage,
  monthsErrorMessage,
}: TimeUnderPracticeFieldProps) {
  return (
    <Box className="gap-3">
      <Box className="gap-1">
        <Text bold className="text-foreground">
          Time under this practice
        </Text>
        <Text size="sm" className="text-muted-foreground">
          How long this has already been the norm here — helps confirm it&apos;s
          a real baseline, not a recent change.
        </Text>
      </Box>

      <Box className="flex-row gap-3">
        <Box className="flex-1">
          <AppNumberInput
            placeholder="0"
            unit="years"
            value={yearsValue}
            onChange={onChangeYears}
            errorMessage={yearsErrorMessage}
          />
        </Box>

        <Box className="flex-1">
          <AppNumberInput
            placeholder="0"
            unit="months"
            value={monthsValue}
            onChange={onChangeMonths}
            errorMessage={monthsErrorMessage}
          />
        </Box>
      </Box>
    </Box>
  );
}
