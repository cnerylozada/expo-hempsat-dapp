import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

export type StepperProps = {
  steps: string[]; // one label per step
  currentStep: number; // zero-based index of the active step
  onStepPress?: (index: number) => void;
};

export const Stepper = ({ steps, currentStep, onStepPress }: StepperProps) => (
  <Box className="gap-2">
    <Box className="flex-row items-center justify-between gap-4">
      <Text bold className="text-primary">
        Step {currentStep + 1} of {steps.length}
      </Text>
      <Text className="shrink text-muted-foreground" numberOfLines={1}>
        {steps[currentStep]}
      </Text>
    </Box>

    <Box className="flex-row gap-2">
      {steps.map((label, index) => {
        const isDone = index < currentStep;
        const bar = (
          <Box
            className={`h-1.5 rounded-full ${
              index <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        );

        return isDone && onStepPress ? (
          <Pressable
            key={label}
            onPress={() => onStepPress(index)}
            hitSlop={{ top: 12, bottom: 12 }}
            accessibilityRole="button"
            accessibilityLabel={`Go back to step ${index + 1}, ${label}`}
            className="flex-1 active:opacity-70"
          >
            {bar}
          </Pressable>
        ) : (
          <Box key={label} className="flex-1">
            {bar}
          </Box>
        );
      })}
    </Box>
  </Box>
);
