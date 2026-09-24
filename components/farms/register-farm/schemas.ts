import { photoShape } from "@/components/shared/schemas";
import { z } from "zod";

export const MAX_TITLE_DEED_PHOTOS = 3;

const titleDeedPhotoSchema = photoShape.refine(
  (_) => _.width >= 600 && _.height >= 900,
  { message: "Too small (min 600×900px)" },
);

export const registerFarmSchema = z.object({
  name: z
    .string({ message: "Farm name is required" })
    .min(20, "Farm name must be at least 20 characters"),
  titleDeedPhotoList: z
    .array(titleDeedPhotoSchema)
    .min(1, "At least 1 photo is required")
    .max(
      MAX_TITLE_DEED_PHOTOS,
      `At most ${MAX_TITLE_DEED_PHOTOS} photos allowed`,
    ),
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
