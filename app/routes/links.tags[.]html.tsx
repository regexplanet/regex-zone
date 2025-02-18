import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, useLoaderData, useSearchParams } from "@remix-run/react";
import { dbconnection } from "~/db/connection.server";
import { TagTree, TagTreeEntry } from "~/components/TagTree";
import { authenticator } from "~/services/auth.server";


export const meta: MetaFunction = () => {
    return [
        { title: "Links by Tag - Regex Zone" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {

    const user = await authenticator.isAuthenticated(request);

    const taglinks = await dbconnection`SELECT rxl_id, rxl_title, rxl_url, UNNEST(rxl_tags) as tag FROM regex_link ORDER BY tag`;

    const tagmap: { [key: string]: TagTreeEntry[]; } = {};
    for (const taglink of taglinks) {
        const tag = taglink.tag;
        let links = tagmap[tag];
        if (!links) {
            links = [];
            tagmap[tag] = links;
        }
        links.push({ 
            id: taglink.rxl_id, 
            title: taglink.rxl_title, 
            url: user?.isAdmin ? `/links/edit.html?rxl_id=${encodeURIComponent(taglink.rxl_id)}` : taglink.rxl_url 
        });
    }

    return json(tagmap);
}

export default function Tags() {
    const tagMap = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const currentTag = searchParams.get("tag") || "";

    return (
        <>
            <h1 className="py-2">Links by Tag</h1>
            {TagTree(currentTag, tagMap)}
            <div className="mt-3">
                {Object.entries(tagMap).length} tags
            </div>
            <RemixLink to="/links/untagged.html" className="btn btn-primary mt-3">Untagged</RemixLink>
        </>
    );

}