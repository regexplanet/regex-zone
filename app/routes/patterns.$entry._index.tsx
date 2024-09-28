//import type { MetaFunction } from "@remix-run/node";
//import { json } from "@remix-run/node";
import { json, type MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
//import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { PiClipboardBold, PiPlayBold } from "react-icons/pi";
import Markdown from 'react-markdown'

import { get, initialize, PatternEntry, PatternEntryVariation } from "~/components/Patterns";
import { TagList } from "~/components/TagList";
import { PatternTagUrlBuilder } from "~/util/PatternTagUrlBuilder";

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

            <div className="d-flex justify-content-between align-items-center">
                <h1 className="py-2">{entry.title}</h1>
                <div>
                {entry.tags ? <TagList tags={entry.tags} urlBuilder={PatternTagUrlBuilder} /> : <i>(none)</i>}
                </div>
            </div>

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
    const [_, copyToClipboard] = useCopyToClipboard();
    return (
        <tr>
            <td>{variation.title}</td>
            <td>
                <code>{variation.pattern}</code>
            </td>
            <td>
                <button
                    className="btn btn-sm btn-outline-secondary ms-2 px-1 pt-0 pb-1"
                    onClick={() => copyToClipboard(variation.pattern)}
                ><PiClipboardBold title="copy to clipboard" /></button>
                <form action="https://www.regexplanet.com/advanced/java/index.html" className="d-inline" method="post" target="_blank">
                    <input type="hidden" name="regex" value={variation.pattern} />
                    <input type="hidden" name="replacement" value={variation.replacement} />
                    <button className="btn btn-sm btn-outline-secondary ms-2 px-1 pt-0 pb-1" ><PiPlayBold title="Test" /></button>
                </form>
            </td>
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