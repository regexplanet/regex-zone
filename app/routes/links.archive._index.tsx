import type { MetaFunction } from "react-router";
import { data, Link, useLoaderData } from "react-router";
import { dbconnection } from "~/db/connection.server";


export const meta: MetaFunction = () => {
    return [
        { title: "Links Archive - Regex Zone" },
    ];
};

export async function loader() {

    const archiveyears = await dbconnection`SELECT EXTRACT(YEAR FROM rxl_created_at) AS year, COUNT(*) as count FROM regex_link GROUP BY EXTRACT(YEAR FROM rxl_created_at) ORDER BY EXTRACT(YEAR FROM rxl_created_at) DESC`;

    return data(archiveyears);
}

export default function Tags() {
    const archiveyears = useLoaderData<typeof loader>();

    return (
        <>
            <h1 className="py-2">Links Archive</h1>
            { archiveyears.map((archiveyear) => (
                <div className="mb-3" key={archiveyear.year}>
                    <Link className="btn btn-primary" to={`/links/archive/${archiveyear.year}/`}>{archiveyear.year}</Link> ({archiveyear.count})
                </div>
            )) }
        </>
    );

}
