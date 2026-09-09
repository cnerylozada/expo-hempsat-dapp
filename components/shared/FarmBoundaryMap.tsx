import {
  BoundaryDrawingPanel,
  MAP_TYPES,
} from "@/components/shared/BoundaryDrawingPanel";
import {
  LatLng,
  LOCATION_OFF_MESSAGE,
  LOCATION_OFF_TITLE,
  PERMISSION_DENIED_MESSAGE,
  PERMISSION_DENIED_TITLE,
  polygonAreaInSquareMeters,
} from "@/components/shared/utils";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { cssInterop } from "nativewind";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

type FarmPolygon = {
  id: string;
  coordinates: LatLng[];
};

export type FarmBoundaryMapProps = {
  onExit: () => void;
};

const MOCK_FARM_POLYGONS: FarmPolygon[] = [
  {
    // ~3km north
    id: "polygon-1",
    coordinates: [
      { latitude: -12.0824, longitude: -77.0148 },
      { latitude: -12.0824, longitude: -77.0134 },
      { latitude: -12.0838, longitude: -77.0134 },
      { latitude: -12.0838, longitude: -77.0148 },
    ],
  },
  {
    // ~3km east
    id: "polygon-2",
    coordinates: [
      { latitude: -12.1094, longitude: -76.9857 },
      { latitude: -12.1094, longitude: -76.9871 },
      { latitude: -12.1108, longitude: -76.9871 },
      { latitude: -12.1108, longitude: -76.9857 },
    ],
  },
  {
    // ~3km south
    id: "polygon-3",
    coordinates: [
      { latitude: -12.1364, longitude: -77.0134 },
      { latitude: -12.1364, longitude: -77.0148 },
      { latitude: -12.1378, longitude: -77.0148 },
      { latitude: -12.1378, longitude: -77.0134 },
    ],
  },
];

const POLYGON_COLORS = ["#e63946", "#2a9d8f", "#e9c46a"];

const DRAWING_COLOR = "#3366aa";

// Google Maps zoom: 0 is the whole world, ~20 is building-level. Close enough
// in that long-pressing to place a corner is precise.
const INITIAL_ZOOM = 17;

const fetchFarmPolygons = async (): Promise<FarmPolygon[]> =>
  Promise.resolve(MOCK_FARM_POLYGONS);

export const FarmBoundaryMap = ({ onExit }: FarmBoundaryMapProps) => {
  const { data: polygons = [] } = useQuery({
    queryKey: ["farms", "polygons"],
    queryFn: fetchFarmPolygons,
  });

  const [vertices, setVertices] = useState<LatLng[]>([]);
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
    // TEMP: mock — nothing to save yet, this just proves out the drawing flow.
    console.log("Done pressed — polygon:", vertices);
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
        {polygons.map((polygon, index) => {
          const color = POLYGON_COLORS[index % POLYGON_COLORS.length];
          return (
            <Polygon
              key={polygon.id}
              coordinates={polygon.coordinates}
              strokeColor={color}
              fillColor={`${color}40`}
              strokeWidth={2}
            />
          );
        })}

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
            strokeColor={DRAWING_COLOR}
            strokeWidth={2}
          />
        )}

        {vertices.length >= 3 && (
          <Polygon
            coordinates={vertices}
            strokeColor={DRAWING_COLOR}
            fillColor={`${DRAWING_COLOR}40`}
            strokeWidth={2}
          />
        )}
      </MapView>

      {/* Back button floats absolute on the left so it doesn't push the title
          off-center; the title row centers within the full inset width. */}
      <View className="absolute inset-x-3 top-3">
        <TouchableOpacity
          onPress={onExit}
          className="absolute left-0 z-10 rounded-full bg-black/50 p-2"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <View className="rounded-full bg-black/50 px-3 py-2">
            <Text bold size="sm" className="text-white">
              Draw your farm boundary
            </Text>
          </View>
        </View>
      </View>

      <BoundaryDrawingPanel
        mapType={mapType}
        onCycleMapType={cycleMapType}
        pointCount={vertices.length}
        area={area}
        canConfirm={!!pendingPoint}
        onConfirm={handleConfirm}
        onReset={handleReset}
        onDone={handleDone}
      />
    </View>
  );
};
