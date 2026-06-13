import { createContext, ReactNode, useContext, useState } from "react";

interface PhotoContextType {
  photoList: string[];
  addPhoto: (uris: string[]) => void;
  clearPhotoList: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photoList, setPhotoList] = useState<string[]>([]);

  const addPhoto = (uris: string[]) =>
    setPhotoList((prev) => [...prev, ...uris]);

  const clearPhotoList = () => setPhotoList([]);

  return (
    <PhotoContext.Provider
      value={{
        photoList,
        addPhoto,
        clearPhotoList,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhoto = () => {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error("usePhoto must be used within PhotoProvider");
  return ctx;
};
