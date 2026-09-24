import { FieldRow } from "@/components/shared/FieldRow";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { IFarmArea } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

// `onPress` is what `<Link asChild>` needs — it merges its navigation
// handler onto this prop, which is lost without somewhere to receive it.
export const AreaCard = ({
  farmItem,
  onPress,
}: {
  farmItem: IFarmArea;
  onPress?: () => void;
}) => {
  const { name } = farmItem;
  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-xl border border-border bg-card active:opacity-70"
    >
      <Box className="h-1.5 bg-primary" />

      <Box className="flex-row items-center gap-4 p-4">
        <Box className="rounded-full bg-primary/10 p-3">
          <Ionicons name="leaf-outline" size={26} className="text-primary" />
        </Box>

        <Box className="flex-1 gap-1.5">
          <FieldRow label="Name" value={name} emphasis truncate />
        </Box>

        <Ionicons
          name="chevron-forward"
          size={20}
          className="text-muted-foreground"
        />
      </Box>
    </Pressable>
  );
};
