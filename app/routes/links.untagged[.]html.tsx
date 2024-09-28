import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/react";
import { sql } from "drizzle-orm"

import { cookieStorage } from "~/services/session.server";
import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { authenticator } from "~/services/auth.server";
import Index from "./links._index"

export const meta: MetaFunction = () => {
    return [
        { title: "Untagged Links - Regex Zone" },
        { name: "robots", content: "noindex" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    // Retrieves the current session from the incoming request's Cookie header
    const session = await cookieStorage.getSession(request.headers.get("Cookie"));

    // Retrieve the session value set in the previous request
    const message = session.get("message");

    const links = await dborm.select().from(regex_link).where(sql`ARRAY_LENGTH(${regex_link.rxl_tags}, 1) IS NULL`);
    console.log("untagged links", JSON.stringify(links));
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

export default Index; 