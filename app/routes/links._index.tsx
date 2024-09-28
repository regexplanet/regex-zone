import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { cookieStorage } from "~/services/session.server";
import { User } from "~/types/User";
import { AlertWidget } from "~/components/AlertWidget";
import type { AlertMessage } from "~/types/AlertMessage";
import { db } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { LinkTagUrlBuilder } from "~/util/LinkTagUrlBuilder";
import { TagList } from "~/components/TagList";
import { authenticator } from "~/services/auth.server";
import { PiLockKey } from "react-icons/pi";
import { AdminIcon } from "~/components/AdminIcon";

export const meta: MetaFunction = () => {
    return [
        { title: "Links - Regex Zone" },
        { name: "description", content: "Random interesting links vaguely related to regular expressions" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    // Retrieves the current session from the incoming request's Cookie header
    const session = await cookieStorage.getSession(request.headers.get("Cookie"));

    // Retrieve the session value set in the previous request
    const message = session.get("message");
    console.log("loader message", JSON.stringify(message));

    const links = await db.select().from(regex_link);
 
    const user = authenticator.isAuthenticated(request);
    

    // Commit the session and return the message
    return json(
        { links, message, user },
        {
            headers: {
                "Set-Cookie": await cookieStorage.commitSession(session),
            },
        }
    );
}
export default function Index() {
    const user = useRouteLoaderData<User | null>("root");
    const data = useLoaderData<typeof loader>();

    console.log("func message", JSON.stringify(data));

    const message = data.message as AlertMessage | undefined;

    const links = data.links;
    
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="py-2">Links</h1>
                { user && user.isAdmin ? 
                <div>
                    <RemixLink to="/links/add.html" className="btn btn-primary mx-1"><AdminIcon /> Add</RemixLink>
                        <RemixLink to="/links/import.html" className="btn btn-primary mx-1"><AdminIcon /> Import</RemixLink>
                </div>
                : null }
            </div>
            {message ? <AlertWidget alert={message}/> : null}
            {links.length == 0 ? <div className="alert alert-warning">No links found</div> : 
            <table className="table table-striped table-hover">
                <thead className="d-none">
                    <tr>
                        <th>Description</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {links.map(link => (
                        <tr key={link.rxl_id}>
                            <td><a href={link.rxl_url}>{link.rxl_title}</a></td>
                            <td className="text-end">
                                <TagList tags={link.rxl_tags} urlBuilder={LinkTagUrlBuilder} />
                                { user && user.isAdmin ? 
                                    <>
                                        <RemixLink to={`/links/edit.html?rxl_id=${link.rxl_id}`} className="btn btn-sm btn-secondary mx-1"><AdminIcon /> Edit</RemixLink>
                                        <RemixLink to={`/links/delete.html?rxl_id=${link.rxl_id}`} className="btn btn-sm btn-secondary mx-1"><AdminIcon /> Delete</RemixLink>
                                    </>
                                : null } 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            }
        </>
    );
}