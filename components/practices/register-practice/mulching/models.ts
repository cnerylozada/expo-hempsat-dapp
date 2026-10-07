import type {
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

export const materialOptions = (
  Object.keys(MULCH_MATERIALS) as MulchMaterial[]
).map((value) => ({ value, label: MULCH_MATERIALS[value] }));

export const materialStateOptions = (
  Object.keys(MATERIAL_STATES) as MaterialState[]
).map((value) => ({ value, label: MATERIAL_STATES[value] }));

export const materialSourceOptions = (
  Object.keys(MATERIAL_SOURCES) as MaterialSource[]
).map((value) => ({ value, label: MATERIAL_SOURCES[value] }));
