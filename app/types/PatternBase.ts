import { PatternVariation } from "./PatternVariation";

export type PatternBase = {
  id: string;
  title: string;
  detail_md?: string;
  handle: string;
  fullPath: string;
  tags?: string[];
  variations: PatternVariation[];
};
