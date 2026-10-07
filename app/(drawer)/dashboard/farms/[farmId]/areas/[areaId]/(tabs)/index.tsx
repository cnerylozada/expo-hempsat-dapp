import { useAuthedQuery } from "@/components/authedRequests";
import { formatDate } from "@/components/farms/utils";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FieldRow } from "@/components/shared/FieldRow";
import { TILLAGE_PRACTICES } from "@/components/shared/models";
import { PhotoGallery } from "@/components/shared/PhotoGallery";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { StatusBanner } from "@/components/shared/StatusBanner";
import { Box } from "@/components/ui/box";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getAreaById } from "@/server/areas";
import { CROPS } from "@/server/models";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native";

const plural = (count: number, unit: string) =>
  `${count} ${unit}${count === 1 ? "" : "s"}`;

// The server keeps the time under practice as one total number of months.
const formatTimeUnderPractice = (totalMonths: number) => {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts = [];
  if (years) parts.push(plural(years, "year"));
  if (months) parts.push(plural(months, "month"));
  return parts.length ? parts.join(", ") : "Less than a month";
};

export default function AreaDetail() {
  const { farmId, areaId } = useGlobalSearchParams<{
    farmId: string;
    areaId: string;
  }>();
  const { token } = useAuth();
  const navigation = useNavigation(
    "/(drawer)/dashboard/farms/[farmId]/areas/[areaId]",
  );

  const {
    data: area,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useAuthedQuery(queryKeys.areas.byId(farmId, areaId), () =>
    getAreaById(token, farmId, areaId),
  );

  useEffect(() => {
    if (area?.name) {
      navigation.setOptions({ title: area.name });
    }
  }, [area?.name, navigation]);

  if (isLoading || isRefetching) return <LoadingScreen />;

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-3">
      <SectionTitle title="Details" icon="leaf-outline" />

      {isError ? (
        <StatusBanner
          theme="error"
          title="Something went wrong"
          description={error.message}
          action={{
            icon: "refresh",
            label: "Retry",
            onPress: () => refetch(),
          }}
        />
      ) : (
        area && (
          <>
            <Box className="gap-3 rounded-xl border border-border bg-card p-4">
              <FieldRow label="Name" value={area.name} emphasis />
              <FieldRow label="Description" value={area.description} />
              <FieldRow label="Crop" value={CROPS[area.crop]} />
              <FieldRow
                label="Tillage"
                value={TILLAGE_PRACTICES[area.tillagePractice].label}
              />
              <FieldRow
                label="Practicing"
                value={formatTimeUnderPractice(area.monthsUnderPractice)}
              />
              <FieldRow label="Registered" value={formatDate(area.createdAt)} />
            </Box>

            {area.photos.length > 0 && (
              <>
                <SectionTitle title="Photos" icon="images-outline" />
                <PhotoGallery uris={area.photos} />
              </>
            )}
          </>
        )
      )}
    </ScrollView>
  );
}
