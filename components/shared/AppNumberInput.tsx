import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export type AppNumberInputProps = {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur?: () => void;
  /** Optional — leave it out when a shared heading above already labels the input. */
  label?: string;
  /** Shown inside the box, after the number (e.g. "years"). */
  unit?: string;
  placeholder?: string;
  errorMessage?: string;
};

// A blank box means "not typed yet" — turning it into 0 here would make the
// required-field error unreachable once a digit is deleted.
const toNumberOrUndefined = (text: string) =>
  text === "" ? undefined : Number(text);

export function AppNumberInput({
  value,
  onChange,
  onBlur,
  label,
  unit,
  placeholder,
  errorMessage,
}: AppNumberInputProps) {
  return (
    <FormControl isInvalid={!!errorMessage}>
      {label && (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      <Input>
        <InputField
          placeholder={placeholder}
          value={value !== undefined ? String(value) : ""}
          onChangeText={(text) => onChange(toNumberOrUndefined(text))}
          onBlur={onBlur}
          keyboardType="number-pad"
        />
        {unit && (
          <Text size="sm" className="pr-3 text-muted-foreground">
            {unit}
          </Text>
        )}
      </Input>
      {errorMessage && (
        <FormControlError>
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
