import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { Image, ScrollView } from "react-native";
import ImageViewing from "react-native-image-viewing";

export type PhotoGalleryProps = {
  uris: string[];
};

/**
 * A row of thumbnails that scrolls sideways. Tapping one opens it full screen,
 * where you can swipe between photos and zoom.
 */
export const PhotoGallery = ({ uris }: PhotoGalleryProps) => {
  // Index of the photo open full screen, or null when the viewer is closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {uris.map((uri, index) => (
          <Pressable
            key={uri}
            onPress={() => setOpenIndex(index)}
            accessibilityRole="imagebutton"
            accessibilityLabel={`Photo ${index + 1} of ${uris.length}`}
            className="active:opacity-70"
          >
            <Image source={{ uri }} className="h-28 w-28 rounded-xl bg-muted" />
          </Pressable>
        ))}
      </ScrollView>

      <ImageViewing
        images={uris.map((uri) => ({ uri }))}
        imageIndex={openIndex ?? 0}
        visible={openIndex !== null}
        onRequestClose={() => setOpenIndex(null)}
        FooterComponent={({ imageIndex }) =>
          uris.length > 1 ? (
            <Box className="items-center pb-10">
              <Text size="sm" className="text-white">
                {imageIndex + 1} / {uris.length}
              </Text>
            </Box>
          ) : null
        }
      />
    </>
  );
};
