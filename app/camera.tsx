import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

const CloseButton = () => {
  const router = useRouter();
  return (
    <View className="absolute left-4 top-12">
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <Ionicons name="close-circle-sharp" size={32} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

const ShutterButton = () => {
  return (
    <View className="absolute bottom-20 left-0 right-0 items-center">
      <TouchableOpacity
        onPress={() => {
          console.log("asds");
        }}
      >
        <Ionicons name="add-circle-sharp" size={56} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission?.granted) {
    return (
      <View className="p-3 border rounded-md dark:border-border-info-dark">
        <ThemedText className="mb-2">
          We need your permission to show the camera
        </ThemedText>
        <ThemedButton onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView style={{ flex: 1 }} facing={"back"}>
        <CloseButton />

        <ShutterButton />
      </CameraView>
    </View>
  );
}
