// @/types/allocation.ts

export type AllocationId =
  | "ramen"
  | "dirac"
  | "mode"
  | "scroll"
  | "swell"
  | "puffer";

export interface AllocationRaw {
  id: string;
  name: string;
  short_name: string;
  image_path: string;
  link: string;
}

export interface Allocation extends AllocationRaw {
  eligible: boolean | number;
}
