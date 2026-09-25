import { FieldRow } from "@/components/shared/FieldRow";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { IFarm } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { Image } from "react-native";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

const PLACEHOLDER_IMAGE_URL =
  "https://ladymoonfarms.com/wp-content/uploads/2024/04/LMF-Marc-Laucks-Chambersburg-8216-sunrise-workers-standing-on-trailer-tractor6-1-scaled.jpg";

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
      <Image
        source={{ uri: PLACEHOLDER_IMAGE_URL }}
        resizeMode="cover"
        className="h-40 w-full"
      />

      <Box className="flex-row items-center gap-4 p-4">
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
