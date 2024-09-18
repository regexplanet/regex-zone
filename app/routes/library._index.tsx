import type { MetaFunction } from "@remix-run/node";
import { Badge, Container, Table } from 'react-bootstrap';
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { HeaderSearch } from "~/components/HeaderSearch/HeaderSearch";
import { getAll, initialize, LibraryEntry } from "~/components/Library";
import { TagList } from "~/components/TagList";
import { Footer } from "~/components/Footer";


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


function LibraryEntryRow(entry: LibraryEntry) {
    return (
        <tr key={entry.handle}>
            <td>
                <RemixLink to={`${entry.handle}/`}>{entry.title}</RemixLink>
            </td>
            <td style={{ 'textAlign': 'right' }}>
                {entry.tags ? TagList(entry.tags) : null}
                <Badge bg="secondary">{entry.variations.length}</Badge>
            </td>
        </tr>
    );
}

export default function Index() {
    const entries = useLoaderData<typeof loader>();

    const entryRows = entries.map((entry) => LibraryEntryRow(entry));

    return (
        <>
            <HeaderSearch />
            <Container>
                <h1 className="py-2">Pattern Library</h1>
                <Table className="table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entryRows}
                    </tbody>
                </Table>
                <details><summary>Raw data</summary>
                    <pre>{JSON.stringify(entries, null, 4)}</pre>
                </details>
                <Footer />
            </Container>
        </>
    );
}