import { PRACTICE_COLORS } from "@/components/shared/models";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { PracticeLabel } from "./PracticeLabel";
import { PracticeInfo } from "./utils";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type PracticeOptionProps = {
  practice: PracticeInfo;
  selected: boolean;
  onSelect: () => void;
  onInfoPress: () => void;
};

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
      <PracticeLabel
        name={practice.name}
        color={PRACTICE_COLORS[practice.id]}
        size="lg"
      />
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
