import type { MetaFunction } from "@remix-run/node";
import { Text } from '@mantine/core';

import { HeaderSearch } from "~/components/HeaderSearch/HeaderSearch";
import { get, LibraryEntry } from "~/components/Library";
import { useParams } from "@remix-run/react";


export const meta: MetaFunction = () => {
    return [
        { title: "Library - Regex Zone" },
        { name: "description", content: "A library of useful regular expressions" },
    ];
};

export default function Index() {

    const params = useParams()

    const entry:LibraryEntry = get(params.entry || "");

    return (
        <>
            <HeaderSearch />
            <Text>{JSON.stringify(entry)}</Text>
        </>
    );
}