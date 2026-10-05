import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { PracticeInfo } from "./utils";

export type PracticeLabelProps = {
  practice: PracticeInfo;
  size?: "md" | "lg"; // lg only where the name is the card's title (PracticeOption)
};

/** The practice's colour square next to its name. */
export const PracticeLabel = ({
  practice,
  size = "md",
}: PracticeLabelProps) => (
  <Box className="flex-row items-center gap-2">
    <Box
      className="h-3 w-3 rounded"
      style={{ backgroundColor: practice.color }}
    />
    <Text bold size={size} className="shrink text-foreground">
      {practice.name}
    </Text>
  </Box>
);
