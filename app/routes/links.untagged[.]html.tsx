import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data } from "react-router";
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

    const links = await dborm.select().from(regex_link).where(sql`ARRAY_LENGTH(${regex_link.rxl_tags}, 1) IS NULL`);
    const user = authenticator.isAuthenticated(request);


    // Commit the session and return the message
    return data(
        { links, user },
        {
            headers: {
                "Set-Cookie": await cookieStorage.commitSession(session),
            },
        }
    );
}

export default Index;
