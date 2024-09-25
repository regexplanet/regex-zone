import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import * as yaml from "js-yaml";

const PATTERN_DIR = path.join(process.cwd(), "patterns");

export type PatternEntry = {
  title: string;
  detail?: string; // markdown!
  handle: string;
  fullPath: string;
  tags?: string[];
  variations: PatternEntryVariation[];
};

export type PatternEntryVariation = {
  title: string;
  pattern: string;
  replacement?: string;
  description?: string;
};

const cache: Map<string, PatternEntry> = new Map();
const all: PatternEntry[] = [];

async function initialize() {
  if (all.length > 0) {
    return;
  }
  const fileNames = await fsPromises.readdir(PATTERN_DIR);
  for await (const fileName of fileNames) {
    const fullPath = path.join(PATTERN_DIR, fileName);
    console.log(`filename=${fullPath}`);

    const raw = await fsPromises.readFile(fullPath, "utf-8");
    const parsed = yaml.load(raw, {
      schema: yaml.JSON_SCHEMA,
    }) as PatternEntry;
    parsed.fullPath = fullPath;

    cache.set(parsed.handle, parsed);
    //LATER: validate w/JSON schema
    all.push(parsed);
  }
}

function get(handle: string) {
  const entry = cache.get(handle);

  if (!entry) {
    return null;
  }

  return entry;
}

function getAll(): PatternEntry[] {
  return all;
}

export { get, getAll, initialize };
