import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export type PracticeLabelProps = {
  name: string;
  color: string; // hex, e.g. "#F2D27A"
  size?: "md" | "lg"; // lg only where the name is the card's title (PracticeOption)
};

export const PracticeLabel = ({
  name,
  color,
  size = "md",
}: PracticeLabelProps) => (
  <Box className="flex-row items-center gap-2">
    <Box className="h-3 w-3 rounded" style={{ backgroundColor: color }} />
    <Text bold size={size} className="shrink text-foreground">
      {name}
    </Text>
  </Box>
);
