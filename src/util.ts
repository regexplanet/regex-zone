import * as fs from 'fs';
import * as path from 'path';

async function* walk(dir:string):AsyncGenerator<string, void, void> {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) {
            yield* walk(entry);
        } else if (d.isFile()) {
            yield entry;
        }
    }
}

export {
    walk,
}
