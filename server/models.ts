export interface IUser {
  id: string;
  inquiry_id: string | null;
  first_name: string | null;
  last_name: string | null;
  national_id: string | null;
  avatar_url: string | null;
}

export interface IFarm {
  country: string;
  id: string;
  latitude: number;
  location: string;
  longitude: number;
  user_id: string;
}

export interface ITitleDeedPhoto {
  uri: string;
  width: number;
  height: number;
  fileSizeInMB: number;
}

export interface ICreateFarmInput {
  location: { latitude: number; longitude: number };
  titleDeedPhotoList: ITitleDeedPhoto[];
}
