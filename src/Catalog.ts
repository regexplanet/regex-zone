
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import * as util from './util';

export type CatalogEntry = {
    title: string,
    handle: string,
    filename: string,
};

const cache: Map<string, CatalogEntry> = new Map();
const all:CatalogEntry[] = [];

async function initialize() {
    for await (const filename of util.walk('./catalog')) {
        console.log(`filename=${filename}`);

        const raw = await fsPromises.readFile(filename, 'utf-8');
        const parsed = yaml.load(raw, { filename, schema: yaml.JSON_SCHEMA }) as any;
        parsed.filename = filename;

        cache.set(parsed.handle, parsed);
        all.push(parsed);
    }
}

async function get(handle:string) {
    if (cache.size == 0) {
        await initialize();
    }
    const entry = cache.get(handle);

    if (!entry) {
        throw new Error(`Unknown catalog entry ${handle}`)
    }

    return entry;
}

async function getAll():Promise<CatalogEntry[]> {
    if (cache.size == 0) {
        await initialize();
    }

    return all;
}

export {
    get,
    getAll,
}
