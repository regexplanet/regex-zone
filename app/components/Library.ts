import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import * as yaml from "js-yaml";

const LIBRARY_DIR = path.join(process.cwd(), "library");

export type LibraryEntry = {
  title: string;
  detail?: string; // markdown!
  handle: string;
  fullPath: string;
  tags?: string[];
  variations: LibraryEntryVariation[];
};

export type LibraryEntryVariation = {
  title: string;
  pattern: string;
  description?: string;
};

const cache: Map<string, LibraryEntry> = new Map();
const all: LibraryEntry[] = [];

async function initialize() {
  if (all.length > 0) {
    return;
  }
  const fileNames = await fsPromises.readdir(LIBRARY_DIR);
  for await (const fileName of fileNames) {
    const fullPath = path.join(LIBRARY_DIR, fileName);
    console.log(`filename=${fullPath}`);

    const raw = await fsPromises.readFile(fullPath, "utf-8");
    const parsed = yaml.load(raw, {
      schema: yaml.JSON_SCHEMA,
    }) as LibraryEntry;
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

function getAll(): LibraryEntry[] {
  return all;
}

export { get, getAll, initialize };
