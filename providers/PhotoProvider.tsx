import { createContext, ReactNode, useContext, useState } from "react";

interface PhotoContextType {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <PhotoContext.Provider value={{ photoUri, setPhotoUri }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhoto = () => {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error("usePhoto must be used within PhotoProvider");
  return ctx;
};
