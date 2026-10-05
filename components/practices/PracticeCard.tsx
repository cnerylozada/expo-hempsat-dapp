import { AppButton } from "@/components/shared/AppButton";
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

export type PracticeCardProps = {
  practice: PracticeInfo;
  status: "active" | "finished";
  crop: string; // already formatted, e.g. "Maize"
  period: string; // e.g. "Sep 15, 2026 – today"
  tillage: string; // e.g. "Plowed"
  onPress: () => void;
};

/**
 * One practice in an area's list. The active one stands out and has a
 * "See details" button; a finished one is a plain card you can tap.
 */
export const PracticeCard = ({
  practice,
  status,
  crop,
  period,
  tillage,
  onPress,
}: PracticeCardProps) => {
  const isActive = status === "active";

  const content = (
    <>
      <Box className="flex-row items-center justify-between">
        <PracticeLabel practice={practice} />

        {isActive && (
          <Box className="flex-row items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <Box className="h-2 w-2 rounded-full bg-primary" />
            <Text size="xs" bold className="text-primary">
              In progress
            </Text>
          </Box>
        )}
      </Box>

      <Box className="gap-1">
        <Text size={isActive ? "2xl" : "xl"} bold className="text-foreground">
          {crop}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          {period} · {tillage}
        </Text>
      </Box>
    </>
  );

  if (isActive) {
    return (
      <Box className="gap-3 rounded-2xl border border-primary bg-primary/10 p-4">
        {content}
        <AppButton
          text="See details"
          icon="chevron-forward"
          onPress={onPress}
        />
      </Box>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 active:opacity-70"
    >
      <Box className="flex-1 gap-3">{content}</Box>
      {/* Centred on the right, like InfoCard's chevron. */}
      <Ionicons
        name="chevron-forward"
        size={18}
        className="text-muted-foreground"
      />
    </Pressable>
  );
};
