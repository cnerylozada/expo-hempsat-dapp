import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { usePhoto } from "@/providers/PhotoProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { launchImageLibraryAsync } from "expo-image-picker";
import { usePermissions } from "expo-media-library";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";

const GoBackButton = () => {
  const router = useRouter();
  return (
    <View className="absolute left-4 top-12">
      <TouchableOpacity
        className="bg-black/40 rounded-full"
        onPress={() => {
          router.back();
        }}
      >
        <Ionicons name="arrow-back-circle" size={32} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

const GalleryButton = () => {
  const { addPhoto } = usePhoto();
  const router = useRouter();

  const onSelectImages = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 0.7,
    });
    if (!result.canceled) {
      addPhoto(result.assets.map((_) => _.uri));
      router.back();
    }
  };

  return (
    <View className="absolute left-4 bottom-20">
      <TouchableOpacity onPress={onSelectImages}>
        <Ionicons name="images" size={32} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

const ShutterButton = ({
  onTakePhoto,
}: {
  onTakePhoto: () => Promise<void>;
}) => {
  return (
    <View className="absolute bottom-20 left-1/2 -translate-x-1/2">
      <TouchableOpacity
        onPress={onTakePhoto}
        className="bg-black/40 rounded-full"
      >
        <Ionicons name="add-circle-sharp" size={48} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

const ConfirmPhotoButton = ({ photoTaken }: { photoTaken: string }) => {
  const { addPhoto } = usePhoto();
  const router = useRouter();

  return (
    <View className="absolute bottom-20 left-0 right-0 items-center">
      <TouchableOpacity
        onPress={() => {
          addPhoto([photoTaken]);
          router.back();
        }}
        className="bg-black/40 rounded-full"
      >
        <Ionicons name="checkmark-circle" size={48} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

const DiscardPhotoButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View className="absolute bottom-20 right-4 items-center">
      <TouchableOpacity onPress={onPress} className="bg-black/40 rounded-full">
        <Ionicons name="close-circle" size={48} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermissionResponse, requestGalleryPermission] =
    usePermissions();

  const onRequestAccess = async () => {
    const { status: cameraPermissionStatus } = await requestCameraPermission();
    if (cameraPermissionStatus !== "granted") {
      Alert.alert(
        "Camera access denied",
        "Please enable camera access in your device settings to take photos.",
      );
      return;
    }

    const { status: galleryPermissionStatus } =
      await requestGalleryPermission();
    if (galleryPermissionStatus !== "granted") {
      Alert.alert(
        "Gallery access denied",
        "Please enable photo library access in your device settings to select images.",
      );
      return;
    }
  };

  const [photoTaken, setPhotoTaken] = useState<string | null>(null);

  const onTakePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });
    setPhotoTaken(photo.uri);
  };

  if (!cameraPermission || !galleryPermissionResponse) {
    return <View />;
  }

  if (!cameraPermission?.granted || !galleryPermissionResponse?.granted) {
    return (
      <View className="flex-1 justify-center">
        <View className="p-3 border rounded-md dark:border-border-info-dark">
          <ThemedText className="mb-2">
            We need your permission to access your camera and gallery
          </ThemedText>
          <ThemedButton onPress={onRequestAccess} title="Grant permission" />
        </View>
      </View>
    );
  }

  if (photoTaken) {
    return (
      <View className="flex-1">
        <Image source={{ uri: photoTaken }} className="flex-1" />
        <GoBackButton />
        <ConfirmPhotoButton photoTaken={photoTaken} />
        <DiscardPhotoButton
          onPress={() => {
            setPhotoTaken(null);
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={"back"}>
        <GoBackButton />
        <GalleryButton />
        <ShutterButton onTakePhoto={onTakePhoto} />
      </CameraView>
    </View>
  );
}
