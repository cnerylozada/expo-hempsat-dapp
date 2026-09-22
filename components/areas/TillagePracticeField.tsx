import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { TILLAGE_PRACTICES, TillagePractice } from "@/components/areas/schemas";

export type TillagePracticeFieldProps = {
  value: TillagePractice;
  onChange: (value: TillagePractice) => void;
  errorMessage?: string;
};

export function TillagePracticeField({
  value,
  onChange,
  errorMessage,
}: TillagePracticeFieldProps) {
  return (
    <FormControl isInvalid={!!errorMessage}>
      <FormControlLabel>
        <FormControlLabelText>Current tillage practice</FormControlLabelText>
      </FormControlLabel>

      <Text size="sm" className="text-muted-foreground">
        This sets which regenerative actions this area is eligible to start
        tracking.
      </Text>

      <RadioGroup
        value={value}
        onChange={onChange}
        className="mt-3 gap-3"
      >
        {Object.entries(TILLAGE_PRACTICES).map(([key, { label, hint }]) => {
          const isSelected = value === key;

          return (
            <Radio
              key={key}
              value={key}
              className={`items-center rounded-xl border p-4 ${
                isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <RadioIndicator className={isSelected ? "border-primary" : undefined}>
                {isSelected && <Box className="h-2 w-2 rounded-full bg-primary" />}
              </RadioIndicator>

              <Box className="flex-1 gap-0.5">
                <RadioLabel className={isSelected ? "text-primary" : undefined}>
                  {label}
                </RadioLabel>
                <Text size="sm" className="text-muted-foreground">
                  {hint}
                </Text>
              </Box>
            </Radio>
          );
        })}
      </RadioGroup>

      {errorMessage && (
        <FormControlError>
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
