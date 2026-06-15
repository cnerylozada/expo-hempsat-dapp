import { createContext, ReactNode, useContext, useState } from "react";

export interface IPhotoItem {
  uri: string;
  fileSizeInMB: number;
  width: number;
  height: number;
}

interface IParams {
  max_files: number;
}

interface PhotoContextType {
  photoList: IPhotoItem[];
  addPhoto: (item: IPhotoItem) => void;
  clearPhotoList: () => void;
  params: IParams | null;
  onSetParams: (params: IParams) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photoList, setPhotoList] = useState<IPhotoItem[]>([]);
  const [params, setParams] = useState<IParams | null>(null);

  const onSetParams = (params: IParams) => {
    setParams(params);
  };

  const addPhoto = (photo: IPhotoItem) =>
    setPhotoList((prev) => [...prev, photo]);

  const clearPhotoList = () => setPhotoList([]);

  return (
    <PhotoContext.Provider
      value={{
        params,
        onSetParams,
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
