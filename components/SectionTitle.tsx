import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export type SectionTitleProps = {
  title: string;
  icon?: IconName; // omit for a plain text title
};

export const SectionTitle = ({ title, icon }: SectionTitleProps) => (
  <Box className="flex-row items-center gap-2 border-b border-border pb-2">
    {icon && <Ionicons name={icon} size={18} className="text-primary" />}
    <Text size="lg" bold className="text-foreground">
      {title}
    </Text>
  </Box>
);
