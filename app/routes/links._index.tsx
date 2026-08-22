import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data, Link, useLoaderData, useRouteLoaderData } from "react-router";
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
import { RootLoaderData } from "~/types/RootLoaderData";

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

    const links = await dborm.select().from(regex_link).orderBy(desc(regex_link.rxl_created_at)).limit(100);

    // Commit the session and return the message
    return data(
        { links, message },
        {
            headers: {
                "Set-Cookie": await cookieStorage.commitSession(session),
            },
        }
    );
}
export default function Index() {
    const { user } = useRouteLoaderData<RootLoaderData>("root") as unknown as RootLoaderData;
    const data = useLoaderData<typeof loader>();

    const message = data.message as AlertMessage | undefined;

    const links = data.links as unknown as typeof regex_link.$inferSelect[];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="py-2">Links</h1>
                <div>
                    <Link to="/links/tags.html" className="btn btn-primary mx-1">Tags</Link>
                    <Link to="/links/archive/" className="btn btn-primary mx-1">Archive</Link>
                    {user && user.isAdmin ?
                        <>
                            <Link to="/links/add.html" className="btn btn-primary mx-1"><AdminIcon /> Add</Link>
                            <Link to="/links/import-feed.html" className="btn btn-primary mx-1"><AdminIcon /> Import RSS/Adom Feed</Link>
                            <Link to="/links/import-json.html" className="btn btn-primary mx-1"><AdminIcon /> Import JSON</Link>
                            <a href="/links/backup.json" className="btn btn-primary mx-1"><AdminIcon /> Backup</a>
                        </>
                        : null}
                </div>
            </div>
            {message ? <AlertWidget alert={message} /> : null}
            <LinksTable currentUrl="/links/" links={links} isAdmin={user?.isAdmin}  />
            <Link to="/links/archive/" className="btn btn-primary">Archive</Link>
        </>
    );
}
