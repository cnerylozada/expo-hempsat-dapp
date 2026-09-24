import { z } from "zod";

export const photoShape = z.object({
  uri: z.string(),
  fileSizeInMB: z
    .number()
    .min(0.05, "File too small (min 50KB)")
    .max(5, "File too large (max 5MB)"),
  width: z.number(),
  height: z.number(),
});
