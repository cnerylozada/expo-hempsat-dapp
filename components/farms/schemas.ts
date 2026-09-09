import { MAX_PHOTOS } from "@/components/farms/TitleDeedPhotosField";
import { z } from "zod";

const photoSchema = z
  .object({
    uri: z.string(),
    fileSizeInMB: z
      .number()
      .min(0.05, "File too small (min 50KB)")
      .max(5, "File too large (max 5MB)"),
    width: z.number(),
    height: z.number(),
  })
  .refine((_) => _.width >= 600 && _.height >= 900, {
    message: "Too small (min 600×900px)",
  });

export const registerFarmSchema = z.object({
  name: z
    .string({ message: "Farm name is required" })
    .min(20, "Farm name must be at least 20 characters"),
  titleDeedPhotoList: z
    .array(photoSchema)
    .min(1, "At least 1 photo is required")
    .max(MAX_PHOTOS, `At most ${MAX_PHOTOS} photos allowed`),
  location: z.object(
    {
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    },
    { message: "Location is required" },
  ),
  boundaries: z
    .array(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }),
      { message: "Farm boundary is required" },
    )
    .min(3, "Draw at least 3 points to define your farm boundary"),
});
