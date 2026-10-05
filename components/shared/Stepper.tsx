import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type StepperProps = {
  steps: string[]; // one label per step
  currentStep: number; // zero-based index of the active step
  // Makes completed steps tappable, so the user can go back. Omit to keep it read-only.
  onStepPress?: (index: number) => void;
};

/**
 * Progress indicator for a form split in several steps. It only displays the
 * position; the screen owns the current step and the Back / Next buttons.
 */
export const Stepper = ({ steps, currentStep, onStepPress }: StepperProps) => (
  <Box className="flex-row">
    {steps.map((label, index) => {
      const isDone = index < currentStep;
      const isCurrent = index === currentStep;
      const canPress = isDone && !!onStepPress;

      const circle = (
        <Box
          className={`h-8 w-8 items-center justify-center rounded-full border-2 ${
            isDone || isCurrent
              ? "border-primary bg-primary"
              : "border-border bg-background"
          }`}
        >
          {isDone ? (
            <Ionicons
              name="checkmark"
              size={18}
              className="text-primary-foreground"
            />
          ) : (
            <Text
              size="sm"
              bold
              className={
                isCurrent ? "text-primary-foreground" : "text-muted-foreground"
              }
            >
              {index + 1}
            </Text>
          )}
        </Box>
      );

      return (
        <Box key={label} className="flex-1 items-center gap-1">
          {canPress ? (
            <Pressable
              onPress={() => onStepPress(index)}
              accessibilityRole="button"
              accessibilityLabel={`Go back to step ${index + 1}, ${label}`}
              className="active:opacity-70"
            >
              {circle}
            </Pressable>
          ) : (
            circle
          )}

          <Text
            size="xs"
            bold={isCurrent}
            numberOfLines={1}
            className={isCurrent ? "text-foreground" : "text-muted-foreground"}
          >
            {label}
          </Text>
        </Box>
      );
    })}
  </Box>
);
