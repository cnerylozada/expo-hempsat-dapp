import type { TillagePractice } from "@/server/models";

export const TILLAGE_PRACTICES: Record<
  TillagePractice,
  { label: string; hint: string }
> = {
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
};
