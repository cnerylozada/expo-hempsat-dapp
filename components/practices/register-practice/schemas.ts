import { z } from "zod";

// One text field per step for now: the real fields come later.
export const registerPracticeSchema = z.object({
  crop: z
    .string({ message: "Crop is required" })
    .min(3, "Crop must be at least 3 characters"),
  mulch: z
    .string({ message: "Mulch is required" })
    .min(3, "Mulch must be at least 3 characters"),
  baseline: z
    .string({ message: "Baseline is required" })
    .min(3, "Baseline must be at least 3 characters"),
});

export type RegisterPracticeInput = z.infer<typeof registerPracticeSchema>;
