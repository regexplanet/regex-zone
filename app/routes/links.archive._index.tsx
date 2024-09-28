import type { MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, useLoaderData, useSearchParams } from "@remix-run/react";
import { dbconnection } from "~/db/connection.server";
import { TagTree, TagTreeEntry } from "~/components/TagTree";


export const meta: MetaFunction = () => {
    return [
        { title: "Links Archive - Regex Zone" },
    ];
};

export async function loader() {

    const archiveyears = await dbconnection`SELECT EXTRACT(YEAR FROM rxl_created_at) AS year, COUNT(*) as count FROM regex_link GROUP BY EXTRACT(YEAR FROM rxl_created_at) ORDER BY EXTRACT(YEAR FROM rxl_created_at) DESC`;

    console.log(archiveyears);

    return json(archiveyears);
}

export default function Tags() {
    const archiveyears = useLoaderData<typeof loader>();

    return (
        <>
            <h1 className="py-2">Links Archive</h1>
            { archiveyears.map((archiveyear) => (
                <div className="mb-3" key={archiveyear.year}>
                    <RemixLink className="btn btn-primary" to={`/links/archive/${archiveyear.year}/`}>{archiveyear.year}</RemixLink> ({archiveyear.count})
                </div>
            )) }
        </>
    );

}