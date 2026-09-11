import { AppButton } from "@/components/AppButton";
import { InstructionsCard } from "@/components/InstructionsCard";
import {
  PERMISSION_DENIED_MESSAGE,
  PERMISSION_DENIED_TITLE,
} from "@/components/shared/utils";
import { StatusBanner } from "@/components/StatusBanner";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import * as Location from "expo-location";
import { useState } from "react";
import { Alert } from "react-native";
import { LatLng } from "react-native-maps";

export type FarmLocationFieldProps = {
  /** Coordinates captured so far — omit until the farmer shares a position. */
  value?: LatLng;
  onChange: (coords: LatLng) => void;
  errorMessage?: string;
};

const TIPS = [
  "Stand at the center of your farm before sharing your position",
  "Your position must be within 20m of the location in your photos",
];

export function FarmLocationField({
  value,
  onChange,
  errorMessage,
}: FarmLocationFieldProps) {
  const [placeName, setPlaceName] = useState<string | null>(null);

  const capturePosition = async () => {
    setPlaceName(null);

    const position = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    onChange(coords);

    const [address] = await Location.reverseGeocodeAsync(coords);
    setPlaceName(
      address
        ? [address.city, address.country].filter(Boolean).join(", ")
        : null,
    );
  };

  const onSharePosition = async () => {
    const { status: currentStatus } =
      await Location.getForegroundPermissionsAsync();

    if (currentStatus === "granted") {
      await capturePosition();
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

    await capturePosition();
  };

  return (
    <Box className="gap-3">
      <InstructionsCard
        title="Confirm you are at the farm"
        icon="location-outline"
        items={TIPS}
      />

      {value && (
        <StatusBanner
          theme="success"
          title={placeName ?? "Position shared"}
          description={`Latitude: ${value.latitude.toFixed(5)}, Longitude: ${value.longitude.toFixed(5)}`}
        />
      )}

      <AppButton
        text="Share position"
        icon="locate-outline"
        onPress={onSharePosition}
      />

      {errorMessage && (
        <Text className="text-sm text-destructive">{errorMessage}</Text>
      )}
    </Box>
  );
}
