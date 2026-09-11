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

export interface IFarm {
  name: string;
  country: string;
  id: string;
  user_id: string;
  parcel_id: string;
  address: string;
  boundaries: LatLng[];
  created_at: string;
}

export type CreateFarmInput = z.infer<typeof registerFarmSchema>;

export interface IForecast {
  date: Date;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  humidity: number;
}
