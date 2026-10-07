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

export type PracticeType = "mulching" | "organic_amendments" | "cover_crops";

export type TillagePractice =
  "conventional" | "reduced" | "no_till" | "native_fallow";

export const CROPS = {
  hemp: "Hemp",
  maize: "Maize",
  beans: "Beans",
  potato: "Potato",
  quinoa: "Quinoa",
  coffee: "Coffee",
  cacao: "Cacao",
  fallow: "Fallow",
} as const;
export type Crop = keyof typeof CROPS;

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
  "name" | "description" | "boundaries" | "crop"
> {
  id: string;
  created_at: string;
  tillage_practice: TillagePractice;
  months_under_practice: number;
  attestation_signature: string;
  photos: string[];
}

export interface IAreaDetail extends Omit<
  IRawAreaDetail,
  | "created_at"
  | "tillage_practice"
  | "months_under_practice"
  | "attestation_signature"
> {
  createdAt: Date;
  tillagePractice: TillagePractice;
  monthsUnderPractice: number;
  attestationSignature: string;
}

export interface IRawPracticeSummary {
  id: string;
  type: PracticeType;
  crop: Crop;
  started_at: string;
  finished_at: string | null; // null while the practice is still active
  tillage_practice: TillagePractice;
  created_at: string;
}

export interface IPracticeSummary extends Omit<
  IRawPracticeSummary,
  "created_at"
> {
  createdAt: Date;
}
