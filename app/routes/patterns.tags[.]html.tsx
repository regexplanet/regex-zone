import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";

import { getAll, initialize } from "~/components/Patterns";
import { type TagTreeEntry, TagTree } from "~/components/TagTree";

export const loader = async () => {
    await initialize();

    const tagMap: { [key: string]: TagTreeEntry[] } = {};

    for (const entry of getAll()) {
        if (entry.tags) {
            for (const tag of entry.tags) {
                const tagEntry = { title: entry.title, url: `/patterns/${entry.handle}/` };
                const entries = tagMap[tag];
                if (!entries) {
                    tagMap[tag] = [tagEntry];
                } else {
                    entries.push(tagEntry);
                }
            }
        }
    }
    return json(tagMap);
};


export const meta: MetaFunction = () => {
    return [
        { title: "Patterns by Tag - Regex Zone" },
    ];
};



export default function Tags() {
    const tagMap = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const currentTag = searchParams.get("tag") || "";

    return (
        <>
            <h1 className="py-2">Tags</h1>
            { TagTree(currentTag, tagMap) }
            <hr />
            <details><summary>Raw data</summary>
                <pre>{JSON.stringify(tagMap, null, 4)}</pre>
            </details>
        </>
    );
}