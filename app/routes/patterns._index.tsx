import type { MetaFunction } from "@remix-run/node";
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getAll, initialize, PatternEntry } from "~/components/Patterns";
import { TagList } from "~/components/TagList";

export const loader = async () => {
    await initialize();
    return json(getAll());
};

export const meta: MetaFunction = () => {
    return [
        { title: "Patterns - Regex Zone" },
        { name: "description", content: "A collection of useful regular expression patterns" },
    ];
};

function PatternEntryRow(entry: PatternEntry) {
    return (
        <tr key={entry.handle}>
            <td>
                <RemixLink to={`${entry.handle}/`}>{entry.title}</RemixLink>
            </td>
            <td style={{ 'textAlign': 'right' }}>
                {entry.tags ? TagList(entry.tags) : null}
                <div className="badge text-bg-secondary">{entry.variations.length}</div>
            </td>
        </tr>
    );
}

export default function Index() {
    const entries = useLoaderData<typeof loader>();

    const entryRows = entries.map((entry) => PatternEntryRow(entry));

    return (
        <>
            <h1 className="py-2">Patterns</h1>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {entryRows}
                </tbody>
            </table>
            <details><summary>Raw data</summary>
                <pre>{JSON.stringify(entries, null, 4)}</pre>
            </details>
        </>
    );
}