import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type AppSelectOption<T extends string> = {
  value: T;
  label: string;
};

export type AppSelectProps<T extends string> = {
  label: string;
  description?: string;
  options: AppSelectOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  placeholder?: string;
  errorMessage?: string;
};

export function AppSelect<T extends string>({
  label,
  description,
  options,
  value,
  onChange,
  placeholder,
  errorMessage,
}: AppSelectProps<T>) {
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

      {/* selectedValue only takes the value; SelectInput derives the shown
       * label from whichever SelectItem below matches it. */}
      <Select
        selectedValue={value}
        // Select types this as a plain string, but it can only ever be one of
        // the `options` values rendered below.
        onValueChange={(nextValue) => onChange(nextValue as T)}
        className="mt-3"
      >
        <SelectTrigger variant="outline" size="sm">
          <SelectInput placeholder={placeholder} className="flex-1" />
          <Ionicons
            name="chevron-down"
            size={18}
            className="mr-3 text-foreground/50"
          />
        </SelectTrigger>

        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>

            {options.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>

      {errorMessage && (
        <FormControlError>
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
