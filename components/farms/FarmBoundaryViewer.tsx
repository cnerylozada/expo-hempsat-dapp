import { AppButton } from "@/components/AppButton";
import { MapHeader } from "@/components/shared/MapHeader";
import { BOUNDARY_COLOR } from "@/components/shared/utils";
import { IFarmArea } from "@/server/models";
import { useRef, useState } from "react";
import { Modal, View } from "react-native";
import MapView, { LatLng, Polygon, PROVIDER_GOOGLE } from "react-native-maps";

export type FarmBoundaryViewerProps = {
  boundaries: LatLng[];
  areaList?: IFarmArea[];
};

const EDGE_PADDING = { top: 80, right: 40, bottom: 40, left: 40 };

// Cycled through for each area's own boundary — distinct from
// BOUNDARY_COLOR (the farm's outline) and from each other, so overlapping
// areas stay tellable apart.
const AREA_COLORS = ["#e63946", "#2a9d8f", "#e9c46a", "#9b5de5", "#f4a261"];

export const FarmBoundaryViewer = ({
  boundaries,
  areaList = [],
}: FarmBoundaryViewerProps) => {
  const [isViewing, setIsViewing] = useState(false);
  const mapRef = useRef<MapView>(null);

  return (
    <>
      <AppButton
        text="View farm boundary"
        icon="map-outline"
        onPress={() => setIsViewing(true)}
      />

      <Modal
        visible={isViewing}
        animationType="slide"
        onRequestClose={() => setIsViewing(false)}
      >
        <View className="flex-1">
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            onMapReady={() =>
              mapRef.current?.fitToCoordinates(boundaries, {
                edgePadding: EDGE_PADDING,
                animated: false,
              })
            }
          >
            <Polygon
              coordinates={boundaries}
              strokeColor={BOUNDARY_COLOR}
              fillColor={`${BOUNDARY_COLOR}40`}
              strokeWidth={2}
            />

            {areaList.map((area, index) => {
              const color = AREA_COLORS[index % AREA_COLORS.length];
              return (
                <Polygon
                  key={area.id}
                  coordinates={area.boundaries}
                  strokeColor={color}
                  fillColor={`${color}40`}
                  strokeWidth={2}
                />
              );
            })}
          </MapView>
          <MapHeader title="Farm boundary" onBack={() => setIsViewing(false)} />
        </View>
      </Modal>
    </>
  );
};
