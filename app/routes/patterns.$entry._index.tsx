//import type { MetaFunction } from "@remix-run/node";
//import { json } from "@remix-run/node";
import { json, type MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
//import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Markdown from 'react-markdown'

import { get, initialize, PatternEntry, PatternEntryVariation } from "~/components/Patterns";
import { TagList } from "~/components/TagList";

export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    await initialize();
    return json(get(params["entry"] || ""));
};


export const meta: MetaFunction = () => {
    return [
        { title: "Patterns - Regex Zone" },
        { name: "description", content: "A collection of useful regular expression patterns" },
    ];
};

function PatternEntryView(entry: PatternEntry) {
    return (
        <>

            <div className="float-end mt-4">
                {entry.tags ? TagList(entry.tags) : <i>(none)</i>}
            </div>

            <h1 className="py-2">{entry.title}</h1>

            {entry.detail ? <Markdown>{entry.detail}</Markdown> : null}

            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Variation</th>
                        <th>Pattern</th>
                    </tr>
                </thead>
                <tbody>
                    {entry.variations.length > 0 ? (entry.variations.map((variation) => PatternEntryVariationView(variation))) : <tr><td>(none)</td></tr>}
                </tbody>
            </table>
            <details><summary>Raw data</summary>
                <pre>{JSON.stringify(entry, null, 4)}</pre>
            </details>
        </>
    );
}

function PatternEntryVariationView(variation: PatternEntryVariation) {
    return (
        <tr>
            <td>{variation.title}</td>
            <td><code>{variation.pattern}</code></td>
        </tr>
    )
}

export default function Index() {
    const entry = useLoaderData<typeof loader>();

    return (
        <>
            {entry ? PatternEntryView(entry) : <h1>Not Found</h1>}
        </>
    );
}