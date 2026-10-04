import { AppButton } from "@/components/shared/AppButton";
import { InfoCard } from "@/components/shared/InfoCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { StatusBanner } from "@/components/shared/StatusBanner";
import { Link, useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

// Mock content — the real practices come later.
export default function AreaPractices() {
  const { farmId, areaId } = useGlobalSearchParams<{
    farmId: string;
    areaId: string;
  }>();

  return (
    <View className="flex-1 gap-3">
      <SectionTitle title="Practices" icon="list-outline" />

      <Link
        href={{
          pathname: "/(drawer)/dashboard/farms/[farmId]/areas/[areaId]/practices/new",
          params: { farmId, areaId },
        }}
        asChild
      >
        <AppButton text="Start a new practice" icon="add-circle-outline" />
      </Link>

      <InfoCard icon="leaf-outline" label="Cover cropping" />
      <InfoCard icon="swap-horizontal-outline" label="Crop rotation" />
      <InfoCard icon="water-outline" label="Reduced irrigation" />

      <StatusBanner
        theme="warning"
        title="Mock data"
        description="This screen will list the practices tracked in this area."
      />
    </View>
  );
}
