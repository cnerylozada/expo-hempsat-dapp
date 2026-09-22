import { Box } from "@/components/ui/box";
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
import { Text } from "@/components/ui/text";

export type AppRadioOption<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

export type AppRadioGroupProps<T extends string> = {
  label: string;
  description?: string;
  options: AppRadioOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  errorMessage?: string;
};

export function AppRadioGroup<T extends string>({
  label,
  description,
  options,
  value,
  onChange,
  errorMessage,
}: AppRadioGroupProps<T>) {
  return (
    <FormControl isInvalid={!!errorMessage}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>

      {description && (
        <Text size="sm" className="text-muted-foreground">
          {description}
        </Text>
      )}

      <RadioGroup value={value} onChange={onChange} className="mt-3 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <Radio
              key={option.value}
              value={option.value}
              className={`items-center rounded-xl border p-4 ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {/* The vendored RadioIcon needs an SVG icon library (lucide),
                  which this project doesn't install — a plain dot does the job. */}
              <RadioIndicator
                className={isSelected ? "border-primary" : undefined}
              >
                {isSelected && (
                  <Box className="h-2 w-2 rounded-full bg-primary" />
                )}
              </RadioIndicator>

              <Box className="flex-1 gap-0.5">
                <RadioLabel className={isSelected ? "text-primary" : undefined}>
                  {option.label}
                </RadioLabel>
                {option.hint && (
                  <Text size="sm" className="text-muted-foreground">
                    {option.hint}
                  </Text>
                )}
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
