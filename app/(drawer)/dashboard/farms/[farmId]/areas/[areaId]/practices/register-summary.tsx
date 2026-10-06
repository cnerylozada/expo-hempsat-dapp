import { PracticeInfoSheet } from "@/components/practices/PracticeInfoSheet";
import { PracticeOption } from "@/components/practices/PracticeOption";
import {
  PRACTICE_FLOW_STEPS,
  PRACTICE_RULES,
  PRACTICES,
} from "@/components/practices/utils";
import { ScreenLayout } from "@/components/ScreenLayout";
import { AppButton } from "@/components/shared/AppButton";
import { FlowProgress } from "@/components/shared/FlowProgress";
import { InstructionsCard } from "@/components/shared/InstructionsCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { BottomSheet, BottomSheetRef } from "@/components/ui/bottomsheet";
import type { PracticeType } from "@/server/models";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterPracticeSummary() {
  const { farmId, areaId } = useLocalSearchParams<{
    farmId: string;
    areaId: string;
  }>();
  const { bottom } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [selectedId, setSelectedId] = useState<PracticeType>();
  const [infoId, setInfoId] = useState<PracticeType>();

  const selected = PRACTICES.find((practice) => practice.id === selectedId);
  const info = PRACTICES.find((practice) => practice.id === infoId);

  const onContinue = () => {
    if (!selected) return;
    router.push({
      pathname:
        "/(drawer)/dashboard/farms/[farmId]/areas/[areaId]/practices/register-practice",
      params: { farmId, areaId, type: selected.id },
    });
  };

  return (
    <BottomSheet ref={bottomSheetRef}>
      <ScreenLayout>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-6 pb-6"
        >
          <FlowProgress
            title="How a practice works"
            description="It follows one crop season, from the first day to harvest."
            steps={PRACTICE_FLOW_STEPS}
            currentStep={0}
          />

          <InstructionsCard
            title="Before you start"
            icon="shield-checkmark-outline"
            items={PRACTICE_RULES}
          />

          <View className="gap-3">
            <SectionTitle title="Which practice will you start?" />
            {PRACTICES.map((practice) => (
              <PracticeOption
                key={practice.id}
                practice={practice}
                selected={practice.id === selectedId}
                onSelect={() => setSelectedId(practice.id)}
                onInfoPress={() => {
                  setInfoId(practice.id);
                  bottomSheetRef.current?.open();
                }}
              />
            ))}
          </View>
        </ScrollView>

        <View
          className="border-t border-border pt-6"
          style={{ paddingBottom: bottom }}
        >
          <AppButton
            text={
              selected ? `Continue with ${selected.name}` : "Choose a practice"
            }
            icon="chevron-forward"
            disabled={!selected}
            onPress={onContinue}
          />
        </View>
      </ScreenLayout>

      <PracticeInfoSheet
        practice={info}
        onClose={() => bottomSheetRef.current?.close()}
      />
    </BottomSheet>
  );
}
