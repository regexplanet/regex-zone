import { SerializeFrom } from "@remix-run/node";
import { Link as RemixLink } from "@remix-run/react";

import { Tag } from "./Tag";


export type TagTreeEntry = {
    title: string;
    url: string;
    id?: string;
}


function TagTreeRow(tag: string, currentTag: string, entries: SerializeFrom<TagTreeEntry>[]) {
    return (
        <details className="mt-2" open={tag === currentTag}>
            <summary><Tag tag={tag} url={`?tag=${tag}`} /></summary>
            <ul className="mt-1">
                {entries?.map((entry) => (
                    <li key={entry.url}>
                        <RemixLink to={entry.url}>{entry.title}</RemixLink>
                    </li>
                ))}
            </ul>
        </details>
    )
}

export function TagTree(currentTag: string, tagMap: SerializeFrom<{ [key: string]: SerializeFrom<TagTreeEntry>[] }>) {
    return (
        <>
            {Object.entries(tagMap).map(([key, entries]) => TagTreeRow(key, currentTag, entries))}
        </>
    );
}
