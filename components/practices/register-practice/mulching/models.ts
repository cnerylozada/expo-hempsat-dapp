import type {
  AmountUnit,
  CoverageLevel,
  MaterialSource,
  MaterialState,
  MulchMaterial,
} from "@/server/models";

export const MULCH_MATERIALS: Record<MulchMaterial, string> = {
  crop_residue: "Crop residue",
  straw_or_hay: "Straw or hay",
  leaves_and_cuttings: "Leaves & cuttings",
  other: "Other",
};

export const MATERIAL_STATES: Record<MaterialState, string> = {
  fresh_green: "Fresh / green",
  dry: "Dry",
};

export const MATERIAL_SOURCES: Record<MaterialSource, string> = {
  this_farm: "This farm",
  brought_in: "Brought in",
};

export const AMOUNT_UNITS: Record<AmountUnit, string> = {
  kg: "kg",
  tonnes: "tonnes",
  other: "Other",
};

export const COVERAGE_LEVELS: Record<CoverageLevel, string> = {
  all: "All of it",
  about_half: "About half",
  small_part: "A small part",
};

export const MAX_MULCH_PHOTOS = 10;

export const materialOptions = (
  Object.keys(MULCH_MATERIALS) as MulchMaterial[]
).map((value) => ({ value, label: MULCH_MATERIALS[value] }));

export const materialStateOptions = (
  Object.keys(MATERIAL_STATES) as MaterialState[]
).map((value) => ({ value, label: MATERIAL_STATES[value] }));

export const materialSourceOptions = (
  Object.keys(MATERIAL_SOURCES) as MaterialSource[]
).map((value) => ({ value, label: MATERIAL_SOURCES[value] }));

export const amountUnitOptions = (
  Object.keys(AMOUNT_UNITS) as AmountUnit[]
).map((value) => ({ value, label: AMOUNT_UNITS[value] }));

export const coverageOptions = (
  Object.keys(COVERAGE_LEVELS) as CoverageLevel[]
).map((value) => ({ value, label: COVERAGE_LEVELS[value] }));
