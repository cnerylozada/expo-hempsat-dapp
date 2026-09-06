import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { IFarm } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import React from "react";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

type FarmCardProps = Pick<IFarm, "country" | "location"> &
  React.ComponentProps<typeof Pressable>;

const MOCK_FARM_NAME = "Green Valley Farm";

const FarmField = ({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <Box className="flex-row items-baseline gap-2">
    <Text
      size="2xs"
      className="w-16 uppercase tracking-wide text-muted-foreground"
    >
      {label}
    </Text>
    <Text
      size="sm"
      bold={emphasis}
      numberOfLines={1}
      className="flex-1 text-foreground"
    >
      {value}
    </Text>
  </Box>
);

export const FarmCard = ({ country, location, ...props }: FarmCardProps) => {
  return (
    <Pressable
      {...props}
      className="overflow-hidden rounded-xl border border-border bg-card active:opacity-70"
    >
      <Box className="h-1.5 bg-primary" />

      <Box className="flex-row items-center gap-4 p-4">
        <Box className="rounded-full bg-primary/10 p-3">
          <Ionicons name="leaf-outline" size={26} className="text-primary" />
        </Box>

        <Box className="flex-1 gap-1.5">
          <FarmField label="Name" value={MOCK_FARM_NAME} emphasis />
          <FarmField label="Location" value={location} />
          <FarmField label="Country" value={country} />
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
