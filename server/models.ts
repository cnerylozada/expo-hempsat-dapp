import type { registerAreaSchema } from "@/components/areas/register-area/schemas";
import { registerFarmSchema } from "@/components/farms/register-farm/schemas";
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

export type CreateFarmInput = z.infer<typeof registerFarmSchema>;

export interface IRawFarm {
  name: string;
  country: string;
  id: string;
  parcel_id: string;
  address: string;
  boundaries: LatLng[];
  created_at: string;
}

export interface IFarm extends Omit<IRawFarm, "created_at" | "parcel_id"> {
  createdAt: Date;
  parcelId: string;
}

export interface IForecast {
  date: Date;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  humidity: number;
}

export interface IRawAreaSummary {
  id: string;
  name: string;
  description: string;
  boundaries: LatLng[];
  created_at: string;
}

export interface IAreaSummary extends Omit<IRawAreaSummary, "created_at"> {
  createdAt: Date;
}

export type CreateAreaInput = z.infer<typeof registerAreaSchema>;

export interface IRawAreaDetail extends Pick<
  CreateAreaInput,
  "name" | "description" | "boundaries"
> {
  id: string;
  created_at: string;
  tillage_practice: CreateAreaInput["tillagePractice"];
  current_crop: CreateAreaInput["currentCrop"];
  months_under_practice: number;
  attestation_signature: string;
  photos: string[];
}

export interface IAreaDetail
  extends
    Pick<CreateAreaInput, "name" | "description" | "boundaries">,
    Pick<IRawAreaDetail, "photos"> {
  id: string;
  createdAt: Date;
  tillagePractice: CreateAreaInput["tillagePractice"];
  currentCrop: CreateAreaInput["currentCrop"];
  monthsUnderPractice: number;
  attestationSignature: string;
}
