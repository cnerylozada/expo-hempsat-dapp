import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export type FieldRowProps = {
  label: string;
  value: string;
  emphasis?: boolean;
  truncate?: boolean;
};

export const FieldRow = ({
  label,
  value,
  emphasis = false,
  truncate = false,
}: FieldRowProps) => (
  <Box className="flex-row items-baseline gap-2">
    <Text
      size="2xs"
      className="w-20 uppercase tracking-wide text-muted-foreground"
    >
      {label}
    </Text>
    <Text
      size="sm"
      bold={emphasis}
      numberOfLines={truncate ? 1 : undefined}
      className="flex-1 text-foreground"
    >
      {value}
    </Text>
  </Box>
);
