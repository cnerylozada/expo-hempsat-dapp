import { PRACTICES } from "@/components/practices/utils";
import { ScreenLayout } from "@/components/ScreenLayout";
import type { PracticeType } from "@/server/models";
import { useLocalSearchParams } from "expo-router";

// Step 2 of starting a practice: the form of the practice picked in
// register-summary. farmId, areaId and type come from the route.
export default function RegisterPractice() {
  const { type } = useLocalSearchParams<{
    farmId: string;
    areaId: string;
    type: PracticeType;
  }>();
  // Route params are plain strings, so the practice may be missing.
  const practice = PRACTICES.find((p) => p.id === type);

  return <ScreenLayout>{null}</ScreenLayout>;
}
