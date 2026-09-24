import { z } from "zod";

export const TILLAGE_PRACTICES = {
  conventional: {
    label: "Conventional tillage",
    hint: "Regular soil disturbance",
  },
  reduced: {
    label: "Reduced tillage",
    hint: "Some disturbance, less frequent",
  },
  no_till: { label: "No-till", hint: "Already practicing minimal disturbance" },
  native_fallow: { label: "Native / fallow", hint: "Never cultivated" },
} as const;
export type TillagePractice = keyof typeof TILLAGE_PRACTICES;
export const tillagePracticeEnum = z.enum(
  Object.keys(TILLAGE_PRACTICES) as [TillagePractice, ...TillagePractice[]],
);
export const tillagePracticeOptions = (
  Object.keys(TILLAGE_PRACTICES) as TillagePractice[]
).map((practice) => ({ value: practice, ...TILLAGE_PRACTICES[practice] }));

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
export const commonCrops = Object.keys(CROPS) as [Crop, ...Crop[]];
export const cropOptions = commonCrops.map((crop) => ({
  value: crop,
  label: CROPS[crop],
}));

export const registerAreaSchema = z.object({
  name: z
    .string({ message: "Area name is required" })
    .min(10, "Area name must be at least 10 characters"),
  description: z
    .string({ message: "Description is required" })
    .min(30, "Description must be at least 30 characters"),
  tillagePractice: tillagePracticeEnum,
  currentCrop: z.enum(commonCrops),
  yearsUnderPractice: z
    .int({ message: "Years under practice must be a whole number" })
    .min(0, "Years under practice can't be negative"),
  monthsUnderPractice: z
    .int({ message: "Months under practice must be a whole number" })
    .min(0, "Months under practice can't be negative")
    .max(11, "Months under practice must be 11 or less"),
  boundaries: z
    .array(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }),
      { message: "Area boundary is required" },
    )
    .min(3),
  // No input of its own: filled in by signAndSave right before the mutation,
  // so it is always absent while the user is editing the form.
  signature: z.string().optional(),
});
