import { TILLAGE_PRACTICES } from "@/components/shared/models";
import { formatDate } from "@/components/farms/utils";
import { AppButton } from "@/components/shared/AppButton";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { CROPS, IPracticeSummary } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { PracticeLabel } from "./PracticeLabel";
import { PRACTICES } from "./utils";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type PracticeCardProps = {
  practiceSummary: IPracticeSummary;
  onPress: () => void;
};

// "2026-09-15" as a local date. new Date("2026-09-15") is midnight UTC, which
// shows as the previous day west of Greenwich.
const parseDay = (day: string) => {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date);
};

export const PracticeCard = ({
  practiceSummary,
  onPress,
}: PracticeCardProps) => {
  const { type, started_at, finished_at, tillage_practice } = practiceSummary;
  const practice = PRACTICES.find((p) => p.id === type);
  // A type the app doesn't know yet has nothing to draw.
  if (!practice) return null;

  const crop = CROPS[practiceSummary.crop];
  const period = `${formatDate(parseDay(started_at))} – ${
    finished_at ? formatDate(parseDay(finished_at)) : "today"
  }`;
  const tillage = TILLAGE_PRACTICES[tillage_practice].label;
  const isActive = finished_at === null;

  const content = (
    <>
      <Box className="flex-row items-center justify-between">
        <PracticeLabel name={practice.name} color={practice.color} />

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
      <Ionicons
        name="chevron-forward"
        size={18}
        className="text-muted-foreground"
      />
    </Pressable>
  );
};
