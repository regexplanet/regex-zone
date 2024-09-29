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
        <details className="mt-2" open={tag === currentTag} key={tag} id={tag}>
            <summary><Tag tag={tag} url={`?tag=${encodeURIComponent(tag)}`} onClick={(e) => {
                console.log(`clicked ${tag}`);
                e.preventDefault();
                const el = document.getElementById(tag) as HTMLDetailsElement | null;
                if (el == null) {
                    console.log(`how is el for ${tag} null?`);
                    return;
                }
                el.open = !el.open;
                history.replaceState(null, "", `?tag=${encodeURIComponent(tag)}`);
            }} /> ({entries.length})</summary>
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
