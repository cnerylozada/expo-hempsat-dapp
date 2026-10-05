import { IPhotoItem, usePhoto } from "@/providers/PhotoProvider";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";

export type UseCameraPhotosOptions = {
  maxPhotos: number;
  // A getter rather than a number: it runs inside the focus callback, so it
  // must read the form's current value, not the one from the last render.
  getPhotoCount: () => number;
  onAddPhotos: (photos: IPhotoItem[]) => void;
};

// The camera route is a separate screen, so photos come back through
// PhotoProvider. This tells the camera how many it may take, and on
// returning to the form moves them in (up to maxPhotos) and empties the list.
export function useCameraPhotos({
  maxPhotos,
  getPhotoCount,
  onAddPhotos,
}: UseCameraPhotosOptions) {
  const { onSetParams, photoList, clearPhotoList } = usePhoto();

  useEffect(() => {
    onSetParams({ max_files: maxPhotos });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (photoList.length > 0) {
        const remaining = maxPhotos - getPhotoCount();
        onAddPhotos(photoList.slice(0, remaining));
        clearPhotoList();
      }
    }, [photoList]),
  );
}
