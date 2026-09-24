import { AppButton } from "@/components/shared/AppButton";
import { InstructionsCard } from "@/components/shared/InstructionsCard";
import { BoundaryDrawingMap } from "@/components/shared/BoundaryDrawingMap";
import {
  formatArea,
  polygonAreaInSquareMeters,
} from "@/components/shared/utils";
import { StatusBanner } from "@/components/shared/StatusBanner";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyFarmById } from "@/server/farms";
import { IFarmArea } from "@/server/models";
import { useState } from "react";
import { Modal } from "react-native";
import { LatLng } from "react-native-maps";
import { useAuthedQuery } from "@/components/authedRequests";

export type AreaBoundaryFieldProps = {
  value: LatLng[];
  onChange: (boundaries: LatLng[]) => void;
  errorMessage?: string;
  farmId: string;
  existingAreaList: IFarmArea[];
};

const TIPS = [
  "Stand where you can see the whole area, then open the map",
  "Long-press each corner of the area to mark it",
  "Keep every point inside your farm's own boundary",
  "You need at least 3 points to form a boundary",
  "Tap Done once every corner is placed",
];

export function AreaBoundaryField({
  value,
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

  const hasBoundary = value.length >= 3;

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
          description={`Number of points: ${value.length}, Area: ${formatArea(polygonAreaInSquareMeters(value))}`}
        />
      )}

      <AppButton
        text={"Draw area boundary"}
        icon="map-outline"
        onPress={() => setIsDrawing(true)}
      />

      {errorMessage && (
        <Text className="text-sm text-destructive">{errorMessage}</Text>
      )}

      <Modal
        visible={isDrawing}
        animationType="slide"
        onRequestClose={() => setIsDrawing(false)}
      >
        <BoundaryDrawingMap
          title="Draw your area boundary"
          farmScope={farm?.boundaries}
          defaultAreas={existingAreaList.map((area) => area.boundaries)}
          initialVertices={value}
          onExit={() => setIsDrawing(false)}
          onDone={(boundaries) => {
            onChange(boundaries);
            setIsDrawing(false);
          }}
        />
      </Modal>
    </Box>
  );
}
