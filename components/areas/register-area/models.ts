import { TILLAGE_PRACTICES } from "@/components/shared/models";
import { Crop, CROPS, type TillagePractice } from "@/server/models";

export const tillagePracticeOptions = (
  Object.keys(TILLAGE_PRACTICES) as TillagePractice[]
).map((practice) => ({ value: practice, ...TILLAGE_PRACTICES[practice] }));

export const cropOptions = (Object.keys(CROPS) as Crop[]).map((crop) => ({
  value: crop,
  label: CROPS[crop],
}));

export const MAX_AREA_PHOTOS = 3;
