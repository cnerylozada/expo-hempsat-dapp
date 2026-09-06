import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export type InstructionsCardProps = {
  title: string;
  items: string[];
  icon?: IconName;
};

export function InstructionsCard({
  title,
  items,
  icon = "information-circle-outline",
}: InstructionsCardProps) {
  return (
    <Box className="gap-3 rounded-xl border border-border bg-card p-4">
      <Box className="flex-row items-center gap-2">
        <Ionicons name={icon} size={20} className="text-primary" />
        <Text bold className="text-foreground">
          {title}
        </Text>
      </Box>

      <Box className="gap-2.5">
        {items.map((item, index) => (
          <Box key={index} className="flex-row items-start gap-2.5">
            <Box className="h-5 w-5 items-center justify-center rounded-full bg-muted">
              <Text size="xs" bold className="text-muted-foreground">
                {index + 1}
              </Text>
            </Box>
            <Text size="sm" className="flex-1 text-muted-foreground">
              {item}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
