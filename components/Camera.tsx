import { CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { View } from "react-native";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

export const Camera = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (true || !permission?.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="p-3 border rounded-md dark:border-yellow-300">
        <ThemedText className="mb-2">
          We need your permission to show the camera
        </ThemedText>
        <ThemedButton onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }
};
