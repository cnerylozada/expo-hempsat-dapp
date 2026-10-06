import type { PracticeType, TillagePractice } from "@/server/models";

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

// Each practice has its own colour, wherever it is shown. Hex on purpose: it
// goes into inline `style` and cannot be a theme token.
export const PRACTICE_COLORS: Record<PracticeType, string> = {
  mulching: "#F2D27A",
  organic_amendments: "#EBA97A",
  cover_crops: "#8FD9C4",
};
