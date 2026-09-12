import type { registerFarmSchema } from "@/components/farms/schemas";
import { LatLng } from "react-native-maps";
import type { z } from "zod";

export interface IUser {
  id: string;
  inquiry_id: string | null;
  first_name: string | null;
  last_name: string | null;
  national_id: string | null;
  avatar_url: string | null;
}

export interface IRawFarm {
  name: string;
  country: string;
  id: string;
  user_id: string;
  parcel_id: string;
  address: string;
  boundaries: LatLng[];
  created_at: string;
}

export interface IFarm extends Omit<IRawFarm, "created_at"> {
  created_at: Date;
}

export type CreateFarmInput = z.infer<typeof registerFarmSchema>;

export interface IForecast {
  date: Date;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  humidity: number;
}

export interface IRawFarmArea {
  id: string;
  name: string;
  description: string;
  farm_id: string;
  boundaries: LatLng[];
  created_at: string;
}

export interface IFarmArea extends Omit<IRawFarmArea, "created_at"> {
  created_at: Date;
}
