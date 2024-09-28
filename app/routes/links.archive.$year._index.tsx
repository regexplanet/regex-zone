import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, useLoaderData, useParams, useRouteLoaderData } from "@remix-run/react";
import { desc, sql } from "drizzle-orm";

import { cookieStorage } from "~/services/session.server";
import { User } from "~/types/User";
import { AlertWidget } from "~/components/AlertWidget";
import type { AlertMessage } from "~/types/AlertMessage";
import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { authenticator } from "~/services/auth.server";
import { AdminIcon } from "~/components/AdminIcon";
import LinksTable from "~/components/LinksTable";
import { PiArrowFatUpBold, PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

export const meta: MetaFunction = ({ params }) => {
    return [
        { title: `Links Archive for ${params.year} - Regex Zone` },
    ];
};

const MIN_YEAR = 2007;

export async function loader({ request, params }: LoaderFunctionArgs) {
    // Retrieves the current session from the incoming request's Cookie header
    const session = await cookieStorage.getSession(request.headers.get("Cookie"));

    // Retrieve the session value set in the previous request
    const message = session.get("message");
    console.log("loader message", JSON.stringify(message));

    if (!params || !params.year || !/^2\d{3}$/.test(params.year)) {
        throw new Error("Invalid year");
    }

    const links = await dborm.select()
        .from(regex_link)
        .where(sql`EXTRACT(YEAR FROM ${regex_link.rxl_created_at}) = ${params.year}`)
        .orderBy(desc(regex_link.rxl_created_at));

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
    const params = useParams();
    const user = useRouteLoaderData<User | null>("root");
    const data = useLoaderData<typeof loader>();

    const currentYear = new Date().getFullYear();
    const year = parseInt(params.year || currentYear.toString());


    console.log("func message", JSON.stringify(data));

    const message = data.message as AlertMessage | undefined;

    const links = data.links as unknown as typeof regex_link.$inferSelect[];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="py-2">Links Archive for {year}</h1>
                    <div>
                        { year > MIN_YEAR ? <RemixLink to={`/links/archive/${year - 1}/`} className="btn btn-primary mx-1"><PiCaretLeftBold /> {year - 1}</RemixLink> : null }
                        <RemixLink to="/links/archive/" className="btn btn-primary"><PiArrowFatUpBold /></RemixLink>
                        { year < currentYear ? <RemixLink to={`/links/archive/${year + 1}/`} className="btn btn-primary mx-1">{year + 1} <PiCaretRightBold /></RemixLink> : null }
                    </div>
            </div>
            {message ? <AlertWidget alert={message} /> : null}
            { links.length == 0
              ? <AlertWidget alert={{type: "danger", message: `No links for ${year}`}} />
              : <LinksTable currentUrl={`/links/archive/${year}/`} links={links} isAdmin={user?.isAdmin} />
            }
        </>
    );
}