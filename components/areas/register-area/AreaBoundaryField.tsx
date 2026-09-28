import { useAuthedQuery } from "@/components/authedRequests";
import { AppButton } from "@/components/shared/AppButton";
import { BoundaryDrawingMap } from "@/components/shared/BoundaryDrawingMap";
import { InstructionsCard } from "@/components/shared/InstructionsCard";
import { StatusBanner } from "@/components/shared/StatusBanner";
import {
  formatArea,
  polygonAreaInSquareMeters,
} from "@/components/shared/utils";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyFarmById } from "@/server/farms";
import { IAreaSummary } from "@/server/models";
import { useState } from "react";
import { Modal, View } from "react-native";
import { LatLng } from "react-native-maps";

export type AreaBoundaryFieldProps = {
  boundaries: LatLng[];
  onChange: (boundaries: LatLng[]) => void;
  errorMessage?: string;
  farmId: string;
  existingAreaList: IAreaSummary[];
};

const TIPS = [
  "Stand where you can see the whole area, then open the map",
  "Long-press each corner of the area to mark it",
  "Keep every point inside your farm's own boundary",
  "You need at least 3 points to form a boundary",
  "Tap Done once every corner is placed",
];

export function AreaBoundaryField({
  boundaries,
  onChange,
  errorMessage,
  farmId,
  existingAreaList,
}: AreaBoundaryFieldProps) {
  const { token } = useAuth();

  const { data: farm } = useAuthedQuery(queryKeys.farms.farmById(farmId), () =>
    getMyFarmById(token, farmId),
  );

  const [isDrawing, setIsDrawing] = useState(false);

  const hasBoundary = boundaries.length >= 3;

  return (
    <Box className="gap-3">
      <InstructionsCard
        title="Define this area's boundary"
        icon="map-outline"
        items={TIPS}
      />

      {hasBoundary && (
        <StatusBanner
          theme="success"
          title="Boundary set"
          description={`Number of points: ${boundaries.length}, Area: ${formatArea(polygonAreaInSquareMeters(boundaries))}`}
        />
      )}

      <View className="gap-1">
        <AppButton
          text={"Draw area boundary"}
          icon="map-outline"
          onPress={() => setIsDrawing(true)}
        />

        {errorMessage && (
          <Text className="text-xs font-body text-destructive">
            {errorMessage}
          </Text>
        )}
      </View>

      <Modal
        visible={isDrawing}
        animationType="slide"
        onRequestClose={() => setIsDrawing(false)}
      >
        <BoundaryDrawingMap
          title="Draw your area boundary"
          farmScope={farm?.boundaries}
          defaultAreas={existingAreaList.map((area) => area.boundaries)}
          defaultVertices={boundaries}
          onExit={() => setIsDrawing(false)}
          onDone={(vertices) => {
            onChange(vertices);
            setIsDrawing(false);
          }}
        />
      </Modal>
    </Box>
  );
}
