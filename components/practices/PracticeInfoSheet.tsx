import { PRACTICE_COLORS } from "@/components/shared/models";
import { FieldRow } from "@/components/shared/FieldRow";
import { InstructionsCard } from "@/components/shared/InstructionsCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
} from "@/components/ui/bottomsheet";
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

export type PracticeInfoSheetProps = {
  practice?: PracticeInfo; // nothing is shown until there is one
  onClose: () => void;
};

// Same setup as IdentityCardSheet: render it once in the screen, inside a
// <BottomSheet ref>, and open it with ref.open().
export const PracticeInfoSheet = ({
  practice,
  onClose,
}: PracticeInfoSheetProps) => (
  <BottomSheetPortal
    snapPoints={["85%"]}
    backdropComponent={BottomSheetBackdrop}
  >
    <BottomSheetDragIndicator />
    {practice && (
      <BottomSheetContent className="gap-4 pb-6">
        <Box className="flex-row items-center justify-between">
          <PracticeLabel
            name={practice.name}
            color={PRACTICE_COLORS[practice.id]}
          />
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons
              name="close"
              size={22}
              className="text-muted-foreground"
            />
          </Pressable>
        </Box>

        <Text size="xl" bold className="text-foreground">
          {practice.info.title}
        </Text>
        <Text className="text-muted-foreground">{practice.info.about}</Text>

        <InstructionsCard
          title="Why it helps"
          icon="leaf-outline"
          items={practice.info.benefits}
        />

        <SectionTitle title="What we'll ask you" />
        <Box className="gap-3 rounded-xl border border-border bg-card p-4">
          {practice.info.asks.map((ask) => (
            <FieldRow key={ask.label} label={ask.label} value={ask.value} />
          ))}
        </Box>
      </BottomSheetContent>
    )}
  </BottomSheetPortal>
);
