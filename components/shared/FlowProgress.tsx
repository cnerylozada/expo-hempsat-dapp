import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type FlowStep = {
  title: string;
  subtitle: string;
};

export type FlowProgressProps = {
  steps: FlowStep[];
  /** Zero-based index of the step the user is on. Pass `steps.length` when the flow is finished. */
  currentStep: number;
  /** `list` explains the flow, step by step. `compact` is the one-row summary. */
  variant?: "list" | "compact";
  title?: string;
  description?: string;
};

type State = "done" | "current" | "upcoming";

const getState = (index: number, currentStep: number): State =>
  index < currentStep ? "done" : index === currentStep ? "current" : "upcoming";

// No numbers on purpose: a check means done, and the current step is told
// apart from the next ones by its colour alone.
const Dot = ({ state }: { state: State }) => (
  <Box
    className={`h-8 w-8 items-center justify-center rounded-full border-2 ${
      state === "done"
        ? "border-primary bg-primary"
        : state === "current"
          ? "border-primary bg-background"
          : "border-border bg-background"
    }`}
  >
    {state === "done" && (
      <Ionicons
        name="checkmark"
        size={18}
        className="text-primary-foreground"
      />
    )}
  </Box>
);

/**
 * Shows where the user is in a multi-screen flow (start, check in, close...).
 * Display only: it doesn't navigate. Use `Stepper` for the steps of one form.
 */
export const FlowProgress = ({
  steps,
  currentStep,
  variant = "list",
  title,
  description,
}: FlowProgressProps) => (
  <Box className="gap-4 rounded-2xl border border-border bg-card p-4">
    {(title || description) && (
      <Box className="gap-1">
        {title && (
          <Text size="xl" bold className="text-foreground">
            {title}
          </Text>
        )}
        {description && (
          <Text size="sm" className="text-muted-foreground">
            {description}
          </Text>
        )}
      </Box>
    )}

    {variant === "list" ? (
      <List steps={steps} currentStep={currentStep} />
    ) : (
      <Compact steps={steps} currentStep={currentStep} />
    )}
  </Box>
);

const List = ({
  steps,
  currentStep,
}: Pick<FlowProgressProps, "steps" | "currentStep">) => (
  <Box>
    {steps.map((step, index) => {
      const isLast = index === steps.length - 1;
      return (
        <Box key={step.title} className="flex-row gap-3">
          {/* The line stretches to the row's height, down to the next dot. */}
          <Box className="items-center">
            <Dot state={getState(index, currentStep)} />
            {!isLast && (
              <Box
                className={`my-1 w-0.5 flex-1 ${
                  index < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </Box>

          <Box className={`flex-1 gap-0.5 ${isLast ? "" : "pb-5"}`}>
            <Text bold className="text-foreground">
              {step.title}
            </Text>
            <Text size="sm" className="text-muted-foreground">
              {step.subtitle}
            </Text>
          </Box>
        </Box>
      );
    })}
  </Box>
);

const Compact = ({
  steps,
  currentStep,
}: Pick<FlowProgressProps, "steps" | "currentStep">) => (
  <Box className="gap-2">
    {/* Each cell is [line][dot][line], so the dots stay centred over the
        labels and no line ever has to be drawn over a dot. */}
    <Box className="flex-row">
      {steps.map((step, index) => (
        <Box key={step.title} className="flex-1 flex-row items-center">
          <Connector hidden={index === 0} reached={index - 1 < currentStep} />
          <Dot state={getState(index, currentStep)} />
          <Connector
            hidden={index === steps.length - 1}
            reached={index < currentStep}
          />
        </Box>
      ))}
    </Box>

    <Box className="flex-row">
      {steps.map((step, index) => (
        <Box key={step.title} className="flex-1 items-center gap-0.5">
          <Text
            size="sm"
            bold
            className={
              getState(index, currentStep) === "current"
                ? "text-primary"
                : "text-foreground"
            }
          >
            {step.title}
          </Text>
          <Text size="xs" className="text-center text-muted-foreground">
            {step.subtitle}
          </Text>
        </Box>
      ))}
    </Box>
  </Box>
);

// Solid once the user got past the step before it, dashed while still ahead.
const Connector = ({
  hidden,
  reached,
}: {
  hidden: boolean;
  reached: boolean;
}) => (
  <Box
    className={`h-0 flex-1 border-t-2 ${
      hidden
        ? "border-transparent"
        : reached
          ? "border-primary"
          : "border-dashed border-border"
    }`}
  />
);
