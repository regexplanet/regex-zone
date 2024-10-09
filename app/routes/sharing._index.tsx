import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { desc } from "drizzle-orm";
import { PiClipboardBold, PiPlayBold } from "react-icons/pi";

import { dborm } from "~/db/connection.server";
import { regex_share } from "~/db/schema";

export const meta: MetaFunction = () => {
    return [
        { title: "Sharing - Regex Zone" },
        { name: "description", content: "Regular expressions shared by the community" },
    ];
};

export async function loader() {

    const theShares = await dborm.select().from(regex_share).orderBy(desc(regex_share.rxs_created_at)).limit(100);

    return theShares;
}

export default function Index() {
    const data = useLoaderData<typeof loader>();
    const [_, copyToClipboard] = useCopyToClipboard();

    return (
        <>
            <h1 className="py-2">Sharing</h1>
            <table className="table table-striped border-top border-bottom">
                <tbody>
                    {data.map((share) => (
                        <tr key={share.rxs_id}>
                            <td><a href={`https://next.regexplanet.com/share/index.html?share=${share.rxs_share_code}`}>{share.rxs_share_code}</a>
                                <button
                                    className="btn btn-sm btn-outline-secondary ms-2 px-1 pt-0 pb-1"
                                    onClick={() => copyToClipboard(`https://next.regexplanet.com/share/index.html?share=${share.rxs_share_code}`)}
                                ><PiClipboardBold title="copy to clipboard" /></button>
                            </td>
                            <td>{share.rxs_title || share.rxs_regex}</td>
                            <td>

                                <form action="https://next.regexplanet.com/advanced/java/index.html" className="d-inline" method="post" target="_blank">
                                    <input type="hidden" name="regex" value={share.rxs_regex} />
                                    <input type="hidden" name="replacement" value={share.rxs_replacement || ""} />
                                    <button className="btn btn-sm btn-outline-secondary ms-2 px-1 pt-0 pb-1" ><PiPlayBold title="Test" /></button>
                                </form>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}