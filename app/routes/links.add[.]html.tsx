import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, redirect, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm"

import { db } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { authenticator } from "~/services/auth.server";
import { getFormString } from "~/util/getFormString";

export const meta: MetaFunction = () => {
    return [
        { title: "Add Link - Regex Zone" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {

    const user = await authenticator.isAuthenticated(request);
    if (!user || !user.isAdmin) {
        //LATER: flash error
        return redirect("/links/");
    }

    // Commit the session and return the message
    return json(
        { user },
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    await db.insert(regex_link).values({
        rxl_url: getFormString(formData.get("rxl_url")),
        rxl_title: getFormString(formData.get("rxl_title")),
        rxl_tags: getFormString(formData.get("rxl_tags")).split(' '),
    });

    //LATER: flash success
    return redirect("/links/");
}

export default function Index() {

    return (
        <>
            <h1 className="py-2">Add Link</h1>
            <form method="post">
                <div className="mb-3">
                    <label htmlFor="rxl_url" className="form-label">URL</label>
                    <input type="text" className="form-control" id="rxl_url" name="rxl_url" defaultValue="" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rxl_title" className="form-label">Text</label>
                    <input type="text" className="form-control" id="rxl_title" name="rxl_title" defaultValue="" />
                </div>
                <div className="mb-3">
                    <label htmlFor="rxl_tags" className="form-label">Tags</label>
                    <input type="text" className="form-control" id="rxl_tags" name="rxl_tags" defaultValue="" />
                </div>
                <input type="submit" className="btn btn-primary" value="Save" />
                <RemixLink className="btn btn-outline-primary mx-2" to="/links/">Cancel</RemixLink>
            </form>
        </>
    );
}