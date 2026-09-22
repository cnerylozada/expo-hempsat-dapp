import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

export type AppTextInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  errorMessage?: string;
  /** Taller box with text anchored to the top, for free-form descriptions. */
  multiline?: boolean;
};

export function AppTextInput({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  errorMessage,
  multiline = false,
}: AppTextInputProps) {
  return (
    <FormControl isInvalid={!!errorMessage}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input className={multiline ? "h-24 items-start py-2" : undefined}>
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : undefined}
        />
      </Input>
      {errorMessage && (
        <FormControlError>
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
