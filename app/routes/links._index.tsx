import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { desc } from "drizzle-orm";

import { cookieStorage } from "~/services/session.server";
import { User } from "~/types/User";
import { AlertWidget } from "~/components/AlertWidget";
import type { AlertMessage } from "~/types/AlertMessage";
import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { authenticator } from "~/services/auth.server";
import { AdminIcon } from "~/components/AdminIcon";
import LinksTable from "~/components/LinksTable";

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

    const links = await dborm.select().from(regex_link).orderBy(desc(regex_link.rxl_created_at)).limit(100);

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

    const links = data.links as unknown as typeof regex_link.$inferSelect[];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="py-2">Links</h1>
                <div>
                    <RemixLink to="/links/tags.html" className="btn btn-primary mx-1">Tags</RemixLink>
                    <RemixLink to="/links/archive/" className="btn btn-primary mx-1">Archive</RemixLink>
                    {user && user.isAdmin ?
                        <>
                            <RemixLink to="/links/add.html" className="btn btn-primary mx-1"><AdminIcon /> Add</RemixLink>
                            <RemixLink to="/links/import.html" className="btn btn-primary mx-1"><AdminIcon /> Import</RemixLink>
                        </>
                        : null}
                </div>
            </div>
            {message ? <AlertWidget alert={message} /> : null}
            <LinksTable currentUrl="/links/" links={links} isAdmin={user?.isAdmin}  />
            <RemixLink to="/links/archive/" className="btn btn-primary">Archive</RemixLink>
        </>
    );
}