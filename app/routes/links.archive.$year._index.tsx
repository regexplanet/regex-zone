import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, useLoaderData, useParams, useRouteLoaderData } from "@remix-run/react";
import { desc, sql } from "drizzle-orm";

import { User } from "~/types/User";
import { AlertWidget } from "~/components/AlertWidget";
import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { authenticator } from "~/services/auth.server";
import LinksTable from "~/components/LinksTable";
import { PiArrowFatUpBold, PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { MIN_ARCHIVE_YEAR } from "~/util/constants";

export const meta: MetaFunction = ({ params }) => {
    return [
        { title: `Links Archive for ${params.year} - Regex Zone` },
    ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {

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
        { links, user },
    );
}

export default function Index() {
    const params = useParams();
    const user = useRouteLoaderData<User | null>("root");
    const data = useLoaderData<typeof loader>();

    const currentYear = new Date().getFullYear();
    const year = parseInt(params.year || currentYear.toString());

    const links = data.links as unknown as typeof regex_link.$inferSelect[];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="py-2">Links Archive for {year}</h1>
                <div>
                    {year > MIN_ARCHIVE_YEAR ? <RemixLink to={`/links/archive/${year - 1}/`} className="btn btn-primary mx-1"><PiCaretLeftBold /> {year - 1}</RemixLink> : null}
                    <RemixLink to="/links/archive/" className="btn btn-primary"><PiArrowFatUpBold /></RemixLink>
                    {year < currentYear ? <RemixLink to={`/links/archive/${year + 1}/`} className="btn btn-primary mx-1">{year + 1} <PiCaretRightBold /></RemixLink> : null}
                </div>
            </div>
            {links.length == 0
                ? <AlertWidget alert={{ type: "danger", message: `No links for ${year}` }} />
                : <LinksTable currentUrl={`/links/archive/${year}/`} links={links} isAdmin={user?.isAdmin} />
            }
        </>
    );
}