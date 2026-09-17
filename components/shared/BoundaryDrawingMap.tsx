import {
  BoundaryDrawingPanel,
  MAP_TYPES,
} from "@/components/shared/BoundaryDrawingPanel";
import { MapHeader } from "@/components/shared/MapHeader";
import {
  BOUNDARY_COLOR,
  LOCATION_OFF_MESSAGE,
  LOCATION_OFF_TITLE,
  PERMISSION_DENIED_MESSAGE,
  PERMISSION_DENIED_TITLE,
  polygonAreaInSquareMeters,
} from "@/components/shared/utils";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, View } from "react-native";
import MapView, {
  LatLng,
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

export type BoundaryDrawingMapProps = {
  initialVertices?: LatLng[];
  onExit: () => void;
  onDone: (vertices: LatLng[]) => void;
  title: string;
  /** Outer polygon the new boundary must stay inside (e.g. the farm, when
   * drawing one of its areas). Reference only — never edited here. */
  farmScope?: LatLng[];
  /** Boundaries already drawn inside `farmScope` that the new one must not
   * overlap (e.g. the farm's existing areas). Reference only. */
  defaultAreas?: LatLng[][];
};

const INITIAL_ZOOM = 17;

// Both muted on purpose: they're context, never the shape being edited, so
// they must read as clearly distinct from BOUNDARY_COLOR.
const FARM_SCOPE_COLOR = "#6b7280";
const DEFAULT_AREA_COLOR = "#f59e0b";

export const BoundaryDrawingMap = ({
  initialVertices = [],
  onExit,
  onDone,
  title,
  farmScope = [],
  defaultAreas = [],
}: BoundaryDrawingMapProps) => {
  const [vertices, setVertices] = useState<LatLng[]>(initialVertices);
  const [pendingPoint, setPendingPoint] = useState<LatLng | null>(null);
  const [canShowUserLocation, setCanShowUserLocation] = useState(false);
  const [mapTypeIndex, setMapTypeIndex] = useState(0);

  const mapRef = useRef<MapView>(null);
  const mapType = MAP_TYPES[mapTypeIndex];
  const area = useMemo(() => polygonAreaInSquareMeters(vertices), [vertices]);

  const cycleMapType = () =>
    setMapTypeIndex((index) => (index + 1) % MAP_TYPES.length);

  useEffect(() => {
    // Only reachable once permission is granted, so the camera lands on the
    // device's own position instead of a hardcoded one.
    const centerOnCurrentPosition = async () => {
      try {
        const position = await Location.getCurrentPositionAsync({});
        mapRef.current?.animateCamera({
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          zoom: INITIAL_ZOOM,
        });
      } catch {
        // A GPS fix can fail or time out — leaving the camera where it is
        // beats taking the screen down over it.
      }
    };

    const resolveUserLocation = async () => {
      // The device's location toggle is separate from the app's permission:
      // permission can be "granted" while location is off, and either way
      // `showsUserLocation` just renders nothing with no error.
      if (!(await Location.hasServicesEnabledAsync())) {
        // Leave on dismiss: this check only runs on mount, so turning location
        // on afterwards would otherwise leave the blue dot hidden until the
        // map is reopened — which is exactly what going back does.
        Alert.alert(LOCATION_OFF_TITLE, LOCATION_OFF_MESSAGE, [
          { text: "OK", onPress: onExit },
        ]);
        return;
      }

      const { status: currentStatus } =
        await Location.getForegroundPermissionsAsync();

      if (currentStatus === "granted") {
        setCanShowUserLocation(true);
        await centerOnCurrentPosition();
        return;
      }

      if (currentStatus === "denied") {
        Alert.alert(PERMISSION_DENIED_TITLE, PERMISSION_DENIED_MESSAGE);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(PERMISSION_DENIED_TITLE, PERMISSION_DENIED_MESSAGE);
        return;
      }

      setCanShowUserLocation(true);
      await centerOnCurrentPosition();
    };

    resolveUserLocation();
  }, [onExit]);

  const handleConfirm = () => {
    if (!pendingPoint) return;
    setVertices((prev) => [...prev, pendingPoint]);
    setPendingPoint(null);
  };

  const handleReset = () => {
    setVertices([]);
    setPendingPoint(null);
  };

  const handleDone = () => {
    onDone(vertices);
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        showsUserLocation={canShowUserLocation}
        onLongPress={(e) => setPendingPoint(e.nativeEvent.coordinate)}
      >
        {farmScope.length >= 3 && (
          <Polygon
            coordinates={farmScope}
            strokeColor={FARM_SCOPE_COLOR}
            fillColor="transparent"
            strokeWidth={2}
          />
        )}

        {defaultAreas.map((area, index) => (
          <Polygon
            key={index}
            coordinates={area}
            strokeColor={DEFAULT_AREA_COLOR}
            fillColor={`${DEFAULT_AREA_COLOR}30`}
            strokeWidth={1}
          />
        ))}
        {vertices.map((vertex, index) => (
          <Marker
            key={index}
            coordinate={vertex}
            title={`Point ${index + 1}`}
          />
        ))}

        {pendingPoint && (
          <Marker
            coordinate={pendingPoint}
            pinColor="orange"
            title="Unconfirmed"
          />
        )}

        {vertices.length === 2 && (
          <Polyline
            coordinates={vertices}
            strokeColor={BOUNDARY_COLOR}
            strokeWidth={2}
          />
        )}

        {vertices.length >= 3 && (
          <Polygon
            coordinates={vertices}
            strokeColor={BOUNDARY_COLOR}
            fillColor={`${BOUNDARY_COLOR}40`}
            strokeWidth={2}
          />
        )}
      </MapView>

      <MapHeader title={title} onBack={onExit} />

      <BoundaryDrawingPanel
        mapType={mapType}
        onCycleMapType={cycleMapType}
        pointCount={vertices.length}
        area={area}
        canConfirm={!!pendingPoint}
        canFinish={vertices.length >= 3}
        onConfirm={handleConfirm}
        onReset={handleReset}
        onDone={handleDone}
      />
    </View>
  );
};
