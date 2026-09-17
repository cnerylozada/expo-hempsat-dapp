import { z } from "zod";

export const registerAreaSchema = z.object({
  name: z
    .string({ message: "Area name is required" })
    .min(20, "Area name must be at least 20 characters"),
  description: z
    .string({ message: "Description is required" })
    .min(30, "Description must be at least 30 characters"),
  boundaries: z
    .array(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }),
      { message: "Area boundary is required" },
    )
    .min(3),
});
