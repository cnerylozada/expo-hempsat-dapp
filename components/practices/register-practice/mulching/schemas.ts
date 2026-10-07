import {
  CROPS,
  type Crop,
  type MaterialSource,
  type MaterialState,
  type MulchMaterial,
} from "@/server/models";
import { z } from "zod";
import { MATERIAL_SOURCES, MATERIAL_STATES, MULCH_MATERIALS } from "./models";

export const registerPracticeSchema = z
  .object({
    crop: z.enum(Object.keys(CROPS) as [Crop, ...Crop[]], {
      message: "Crop is required",
    }),
    // null means "not planted yet": the date is recorded later, in a check-in.
    plantedAt: z.date({ message: "Planting date is required" }).nullable(),
    startedAt: z.date({ message: "Date applied is required" }),
    material: z.enum(
      Object.keys(MULCH_MATERIALS) as [MulchMaterial, ...MulchMaterial[]],
      { message: "Material is required" },
    ),
    materialOther: z.string(),
    materialState: z.enum(
      Object.keys(MATERIAL_STATES) as [MaterialState, ...MaterialState[]],
      { message: "Fresh or dry is required" },
    ),
    source: z.enum(
      Object.keys(MATERIAL_SOURCES) as [MaterialSource, ...MaterialSource[]],
      { message: "Where it came from is required" },
    ),
    sourceDescription: z.string(),
    // The field below is a placeholder until its step is designed.
    baseline: z
      .string({ message: "Baseline is required" })
      .min(3, "Baseline must be at least 3 characters"),
  })
  // Only "other" has to say what the material was.
  .refine((data) => data.material !== "other" || !!data.materialOther.trim(), {
    path: ["materialOther"],
    message: "Say what the material was",
  })
  // Only "brought in" has to say where the material came from.
  .refine(
    (data) => data.source !== "brought_in" || !!data.sourceDescription.trim(),
    {
      path: ["sourceDescription"],
      message: "Say where it came from",
    },
  )
  // A text that no longer applies is sent empty, whatever was typed before.
  .transform((data) => ({
    ...data,
    materialOther: data.material === "other" ? data.materialOther : "",
    sourceDescription:
      data.source === "brought_in" ? data.sourceDescription : "",
  }));

export type RegisterPracticeInput = z.infer<typeof registerPracticeSchema>;
