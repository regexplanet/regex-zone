import { json, type MetaFunction, SerializeFrom } from "@remix-run/node";
import { Link as RemixLink, useLoaderData, useSearchParams } from "@remix-run/react";
import { Container } from "react-bootstrap";
import { Footer } from "~/components/Footer";

import { HeaderSearch } from "~/components/HeaderSearch/HeaderSearch";
import { getAll, initialize } from "~/components/Library";

type TagEntry = {
    title: string;
    url: string;
}

export const loader = async () => {
    await initialize();

    const tagMap: { [key: string]: TagEntry[] } = {};

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
        { title: "Tags - Regex Zone" },
        { name: "description", content: "Regular Expressions Patterns by Tag" },
    ];
};

function TagRow(tag:string, currentTag: string, entries: SerializeFrom<TagEntry>[]) {
    return (
        <details className="mt-2" open={ tag === currentTag}>
            <summary><span className="badge fs-6 text-bg-primary">{tag.replaceAll('-', ' ')}</span></summary>
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

function TagList(currentTag: string, tagMap: SerializeFrom<{ [key: string]: SerializeFrom<TagEntry>[]}>) {
    return (
        <>
            { Object.entries(tagMap).map(([key, entries]) => TagRow(key, currentTag, entries)) }
        </>
    );
}


export default function Index() {
    const tagMap = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const currentTag = searchParams.get("tag") || "";

    return (
        <>
            <HeaderSearch />
            <Container>
                <h1 className="py-2">Tags</h1>
                { TagList(currentTag, tagMap) }
                <hr />
                <details><summary>Raw data</summary>
                    <pre>{JSON.stringify(tagMap, null, 4)}</pre>
                </details>
            </Container>
            <Footer />
        </>
    );
}