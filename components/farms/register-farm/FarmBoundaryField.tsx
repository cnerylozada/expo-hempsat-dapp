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
import { useState } from "react";
import { Modal } from "react-native";
import { LatLng } from "react-native-maps";

export type FarmBoundaryFieldProps = {
  value: LatLng[];
  onChange: (boundaries: LatLng[]) => void;
  errorMessage?: string;
};

const TIPS = [
  "Stand where you can see the whole plot, then open the map",
  "Long-press each corner of your farm to mark it",
  "You need at least 3 points to form a boundary",
  "Tap Done once every corner is placed",
];

export function FarmBoundaryField({
  value,
  onChange,
  errorMessage,
}: FarmBoundaryFieldProps) {
  const [isDrawing, setIsDrawing] = useState(false);

  const hasBoundary = value.length >= 3;

  return (
    <Box className="gap-3">
      <InstructionsCard
        title="Define your farm boundary"
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
        text={"Draw farm boundary"}
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
          title="Draw your farm boundary"
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
