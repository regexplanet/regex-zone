import { PatternTest } from "./PatternTest";

export type PatternVariation = {
  id: string;
  created: string;
  updated: string;
  title: string;
  detail_md?: string;
  pattern: string;
  replacement?: string;
  tests: PatternTest[];
};
