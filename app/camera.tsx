import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { usePhoto } from "@/providers/PhotoProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

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
  return (
    <View className="absolute left-4 bottom-20">
      <TouchableOpacity>
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
    <View className="absolute bottom-20 left-0 right-0 items-center">
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
  const { setPhotoUri } = usePhoto();
  const router = useRouter();

  return (
    <View className="absolute bottom-20 left-0 right-0 items-center">
      <TouchableOpacity
        onPress={() => {
          setPhotoUri(photoTaken);
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
  const [permission, requestPermission] = useCameraPermissions();
  const [photoTaken, setPhotoTaken] = useState<string | null>(null);

  const onTakePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });
    setPhotoTaken(photo.uri);
  };

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
