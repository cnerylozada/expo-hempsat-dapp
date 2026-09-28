import { formatDate } from "@/components/farms/utils";
import { formatArea, polygonAreaInSquareMeters } from "@/components/shared/utils";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { IAreaSummary } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

const Stat = ({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
}) => (
  <Box className="flex-row items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
    <Ionicons name={icon} size={14} className="text-muted-foreground" />
    <Text size="xs" className="text-foreground">
      {text}
    </Text>
  </Box>
);

export const AreaCard = ({
  areaSummary,
  onPress,
}: {
  areaSummary: IAreaSummary;
  onPress?: () => void;
}) => {
  const { name, description, boundaries, createdAt } = areaSummary;

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-xl border border-border bg-card active:opacity-70"
    >
      <Box className="h-1.5 bg-primary" />

      <Box className="gap-3 p-4">
        <Box className="flex-row items-center gap-4">
          <Box className="rounded-full bg-primary/10 p-3">
            <Ionicons name="leaf-outline" size={26} className="text-primary" />
          </Box>

          <Box className="flex-1 gap-0.5">
            <Text bold numberOfLines={1} className="text-foreground">
              {name}
            </Text>
            {!!description && (
              <Text
                size="sm"
                numberOfLines={2}
                className="text-muted-foreground"
              >
                {description}
              </Text>
            )}
          </Box>

          <Ionicons
            name="chevron-forward"
            size={20}
            className="text-muted-foreground"
          />
        </Box>

        <Box className="flex-row flex-wrap gap-2">
          <Stat
            icon="resize-outline"
            text={formatArea(polygonAreaInSquareMeters(boundaries))}
          />
          <Stat icon="calendar-outline" text={formatDate(createdAt)} />
        </Box>
      </Box>
    </Pressable>
  );
};
