import { FieldRow } from "@/components/FieldRow";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { IFarm } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

// `onPress` is what `<Link asChild>` needs — it merges its navigation
// handler onto this prop, which is lost without somewhere to receive it.
export const FarmCard = ({
  farmItem,
  onPress,
}: {
  farmItem: IFarm;
  onPress?: () => void;
}) => {
  const { name, country, address, parcel_id } = farmItem;
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
          <FieldRow label="Parcel ID" value={parcel_id} emphasis />
          <FieldRow label="Address" value={address} truncate />
          <FieldRow label="Country" value={country} />
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
