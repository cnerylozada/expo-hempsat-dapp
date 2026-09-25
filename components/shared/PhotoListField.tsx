import { AppButton } from "@/components/shared/AppButton";
import { InstructionsCard } from "@/components/shared/InstructionsCard";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import type { FieldErrors } from "react-hook-form";
import { Image, TouchableOpacity } from "react-native";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

type PhotoListItem = {
  id: string;
  uri: string;
  width: number;
  height: number;
  fileSizeInMB: number;
};

type PhotoListErrors = FieldErrors<{ photos: PhotoListItem[] }>["photos"];

export type PhotoListFieldProps = {
  photos: PhotoListItem[];
  maxPhotos: number;
  errors?: PhotoListErrors;
  onRemovePhoto: (index: number) => void;
  label: string;
};

export function PhotoListField({
  photos,
  maxPhotos,
  errors,
  onRemovePhoto,
  label,
}: PhotoListFieldProps) {
  const router = useRouter();

  return (
    <Box className="gap-3">
      <InstructionsCard
        title={label}
        icon="images-outline"
        items={[
          `1 to ${maxPhotos} photos`,
          "JPG or PNG only",
          "Size: 50 KB – 5 MB",
          "Min. dimensions: 600×900 px",
        ]}
      />

      <Box className="gap-4">
        {photos.map((photo, index) => {
          const photoError = errors?.[index];
          const messages = [
            photoError?.message,
            photoError?.fileSizeInMB?.message,
          ].filter((message): message is string => Boolean(message));

          return (
            <Box key={photo.id} className="gap-2">
              <Box className="flex-row gap-2">
                <Badge variant="outline" className="gap-1">
                  <Ionicons
                    name="resize-outline"
                    size={12}
                    className="text-foreground"
                  />
                  <BadgeText>
                    {photo.width}×{photo.height}px
                  </BadgeText>
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Ionicons
                    name="document-outline"
                    size={12}
                    className="text-foreground"
                  />
                  <BadgeText>{photo.fileSizeInMB.toFixed(3)} MB</BadgeText>
                </Badge>
              </Box>

              {messages.map((message) => (
                <Text key={message} className="text-sm text-destructive">
                  {message}
                </Text>
              ))}

              <Box className="relative">
                <Image
                  source={{ uri: photo.uri }}
                  className="h-44 w-full rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => onRemovePhoto(index)}
                  className="absolute right-1 top-1 rounded-full bg-black/50"
                >
                  <Ionicons name="close-circle" size={30} color="white" />
                </TouchableOpacity>
              </Box>
            </Box>
          );
        })}

        {photos.length < maxPhotos && (
          <AppButton
            text="Take a photo"
            icon="camera-outline"
            onPress={() => router.push("/camera")}
          />
        )}
      </Box>

      {errors?.message && (
        <Text className="text-sm text-destructive">{errors.message}</Text>
      )}
    </Box>
  );
}
