import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, redirect, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm"

import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { authenticator } from "~/services/auth.server";
import { getFormString } from "~/util/getFormString";

export const meta: MetaFunction = () => {
    return [
        { title: "Delete Link - Regex Zone" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const { searchParams } = new URL(request.url);

    const rxl_id = searchParams.get("rxl_id");
    if (!rxl_id) {
        //LATER: flash error
        return redirect("/links/");
    }
    
    const links = await dborm.select().from(regex_link).where(eq(regex_link.rxl_id, rxl_id));
    if (!links || links.length != 1) {
        //LATER: flash error
        return redirect("/links/");
    }

    const user = await authenticator.isAuthenticated(request);
    if (!user || !user.isAdmin) {
        //LATER: flash error
        return redirect("/links/");
    }

    // Commit the session and return the message
    return json(
        { link: links[0], user },
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const rxl_id = getFormString(formData.get("rxl_id"));
    if (!rxl_id) {
        //LATER: flash error
        return redirect("/links/");
    }

    const links = await dborm.select().from(regex_link).where(eq(regex_link.rxl_id, rxl_id));
    if (!links || links.length != 1) {
        //LATER: flash error
        return redirect("/links/");
    }

    const user = await authenticator.isAuthenticated(request);
    if (!user || !user.isAdmin) {
        //LATER: flash error
        return redirect("/links/");
    }


    await dborm.delete(regex_link).where(eq(regex_link.rxl_id, rxl_id));

    //LATER: flash success
    return redirect("/links/");
}

export default function Index() {
    const data = useLoaderData<typeof loader>();

    const theLink = data.link;

    return (
        <>
            <h1 className="py-2">Edit Link</h1>
            <form method="post">
                <input type="hidden" name="rxl_id" value={theLink.rxl_id} />
                <div className="mb-3">
                    <label htmlFor="rxl_url" className="form-label">URL</label>
                    <input type="text" className="form-control" id="rxl_url" name="rxl_url" defaultValue={theLink.rxl_url} disabled readOnly />
                </div>
                <div className="mb-3">
                    <label htmlFor="rxl_title" className="form-label">Text</label>
                    <input type="text" className="form-control" id="rxl_title" name="rxl_title" defaultValue={theLink.rxl_title} disabled readOnly />
                </div>
                <div className="mb-3">
                    <label htmlFor="rxl_tags" className="form-label">Tags</label>
                    <input type="text" className="form-control" id="rxl_tags" name="rxl_tags" defaultValue={theLink.rxl_tags.join(' ')} disabled readOnly />
                </div>
                <input type="submit" className="btn btn-primary" value="Delete" />
                <RemixLink className="btn btn-outline-primary mx-2" to="/links/">Cancel</RemixLink>
            </form>
        </>
    );
}