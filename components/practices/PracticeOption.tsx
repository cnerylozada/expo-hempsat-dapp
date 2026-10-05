import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { PracticeInfo } from "./utils";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type PracticeOptionProps = {
  practice: PracticeInfo;
  selected: boolean;
  onSelect: () => void;
  /** Opens the screen's `PracticeInfoSheet` for this practice. */
  onInfoPress: () => void;
};

/**
 * One choice in the "which practice?" list: a card with a radio, the practice's
 * name and summary, and an info button. Only the radio selects; the rest of the
 * card does nothing when tapped.
 */
export const PracticeOption = ({
  practice,
  selected,
  onSelect,
  onInfoPress,
}: PracticeOptionProps) => (
  <Box
    className={`flex-row items-center gap-4 rounded-2xl border p-4 ${
      selected ? "border-primary bg-primary/10" : "border-border bg-card"
    }`}
  >
    <Pressable
      onPress={onSelect}
      hitSlop={12}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={practice.name}
      className={`h-7 w-7 items-center justify-center rounded-full border-2 ${
        selected ? "border-primary" : "border-border"
      }`}
    >
      {selected && <Box className="h-3.5 w-3.5 rounded-full bg-primary" />}
    </Pressable>

    <Box className="flex-1 gap-1">
      <Box className="flex-row items-center gap-2">
        <Box
          className="h-3 w-3 rounded"
          style={{ backgroundColor: practice.color }}
        />
        <Text bold size="lg" className="flex-1 text-foreground">
          {practice.name}
        </Text>
      </Box>
      <Text size="sm" className="text-muted-foreground">
        {practice.summary}
      </Text>
    </Box>

    <Pressable
      onPress={onInfoPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={`About ${practice.name}`}
      className="active:opacity-70"
    >
      <Ionicons
        name="information-circle-outline"
        size={26}
        className="text-muted-foreground"
      />
    </Pressable>
  </Box>
);
