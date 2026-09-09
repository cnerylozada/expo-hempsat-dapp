import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export type InfoCardProps = {
  icon: IconName;
  label: string;
  /** Omit for a read-only row; passing it makes the whole card tappable. */
  onPress?: () => void;
};

const SURFACE =
  "flex-row items-center gap-3 rounded-xl border border-border bg-card p-3";

export function InfoCard({ icon, label, onPress }: InfoCardProps) {
  const content = (
    <>
      <Box className="rounded-full bg-primary/10 p-2">
        <Ionicons name={icon} size={16} className="text-primary" />
      </Box>

      <Text size="sm" className="flex-1 text-foreground" numberOfLines={1}>
        {label}
      </Text>

      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={18}
          className="text-muted-foreground"
        />
      )}
    </>
  );

  if (!onPress) return <Box className={SURFACE}>{content}</Box>;

  return (
    <Pressable onPress={onPress} className={`${SURFACE} active:opacity-70`}>
      {content}
    </Pressable>
  );
}
