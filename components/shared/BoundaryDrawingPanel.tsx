import { AppButton } from "@/components/AppButton";
import { formatArea } from "@/components/shared/utils";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export const MAP_TYPES = ["standard", "satellite"] as const;
export type MapType = (typeof MAP_TYPES)[number];

// The button shows the type currently on screen, so it doubles as a label for
// what you're looking at rather than only a control.
const MAP_TYPE_DISPLAY: Record<
  MapType,
  { label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }
> = {
  standard: { label: "Standard", icon: "map-outline" },
  satellite: { label: "Satellite", icon: "earth-outline" },
};

export type BoundaryDrawingPanelProps = {
  mapType: MapType;
  onCycleMapType: () => void;
  pointCount: number;
  /** Raw m² — formatted here so the caller only ever deals in numbers. */
  area: number;
  canConfirm: boolean;
  /** A polygon needs at least 3 points to enclose any area. */
  canFinish: boolean;
  onConfirm: () => void;
  onReset: () => void;
  onDone: () => void;
};

// "LABEL value" inline; `flex-1` keeps both stats aligned as two columns.
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <Box className="flex-1 flex-row items-baseline gap-1.5">
    <Text size="2xs" className="uppercase tracking-wide text-muted-foreground">
      {label}
    </Text>
    <Text size="sm" bold className="text-foreground">
      {value}
    </Text>
  </Box>
);

/**
 * The floating bottom overlay for drawing a farm boundary: a map-type toggle,
 * a live point/area readout, and Confirm/Reset/Done. Presentational — the
 * caller owns the vertices and the map-type index; this only renders them
 * and forwards taps.
 */
export const BoundaryDrawingPanel = ({
  mapType,
  onCycleMapType,
  pointCount,
  area,
  canConfirm,
  canFinish,
  onConfirm,
  onReset,
  onDone,
}: BoundaryDrawingPanelProps) => {
  const { bottom } = useSafeAreaInsets();

  return (
    // `edgeToEdgeEnabled` draws behind the system bar, so this has to clear
    // it itself or the device's nav buttons sit on top of it.
    <View className="absolute inset-x-3 gap-3" style={{ bottom: bottom + 12 }}>
      <TouchableOpacity
        onPress={onCycleMapType}
        accessibilityRole="button"
        className="flex-row items-center gap-1.5 self-end rounded-full border border-border bg-background/80 px-3 py-2"
      >
        <Ionicons
          name={MAP_TYPE_DISPLAY[mapType].icon}
          size={16}
          className="text-foreground"
        />
        <Text size="sm" className="text-foreground">
          {MAP_TYPE_DISPLAY[mapType].label}
        </Text>
      </TouchableOpacity>

      <Box className="gap-3 rounded-2xl border border-border bg-background/80 p-3">
        <Text size="sm" className="text-muted-foreground">
          Long-press the map to mark your farm&apos;s corners.
        </Text>

        <Box className="flex-row gap-3">
          <InfoItem label="Points" value={String(pointCount)} />
          <InfoItem
            label="Area"
            // Below 3 points there is no area yet — "0 m²" would read as a
            // measurement rather than "not enough points".
            value={pointCount > 2 ? formatArea(area) : "—"}
          />
        </Box>

        <Box className="flex-row gap-2">
          <Box className="flex-1">
            <AppButton
              text="Confirm"
              icon="checkmark-outline"
              disabled={!canConfirm}
              onPress={onConfirm}
            />
          </Box>
          <Box className="flex-1">
            <AppButton
              text="Reset"
              icon="refresh-outline"
              theme="danger"
              outline
              onPress={onReset}
            />
          </Box>
        </Box>

        <AppButton
          text="Done"
          icon="flag-outline"
          theme="secondary"
          disabled={!canFinish}
          onPress={onDone}
        />
      </Box>
    </View>
  );
};
