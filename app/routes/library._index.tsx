import type { MetaFunction } from "@remix-run/node";
import { Table } from '@mantine/core';
import { Link as RemixLink } from "@remix-run/react";

import { HeaderSearch } from "~/components/HeaderSearch/HeaderSearch";
import { getAll, LibraryEntry } from "~/components/Library";


export const meta: MetaFunction = () => {
    return [
        { title: "Library - Regex Zone" },
        { name: "description", content: "A library of useful regular expressions" },
    ];
};

function LibraryEntryRow( entry: LibraryEntry ) {
    return (
        <Table.Tr key={entry.handle}>
            <Table.Td>
                <RemixLink to={`${entry.handle}/`}>{entry.title}</RemixLink>
            </Table.Td>
        </Table.Tr>
    );
}

export default function Index() {

    const entries = getAll().map((entry) => LibraryEntryRow(entry));

    return (
        <>
            <HeaderSearch />
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Title</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {entries}
                </Table.Tbody>
            </Table>
        </>
    );
}