import { CROPS, type Crop } from "@/server/models";
import { z } from "zod";

export const registerPracticeSchema = z.object({
  crop: z.enum(Object.keys(CROPS) as [Crop, ...Crop[]], {
    message: "Crop is required",
  }),
  // null means "not planted yet": the date is recorded later, in a check-in.
  plantedAt: z.date({ message: "Planting date is required" }).nullable(),
  // The fields below are placeholders until their steps are designed.
  mulch: z
    .string({ message: "Mulch is required" })
    .min(3, "Mulch must be at least 3 characters"),
  baseline: z
    .string({ message: "Baseline is required" })
    .min(3, "Baseline must be at least 3 characters"),
});

export type RegisterPracticeInput = z.infer<typeof registerPracticeSchema>;
