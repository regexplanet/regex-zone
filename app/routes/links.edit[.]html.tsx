import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, redirect, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm"

import { db } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { authenticator } from "~/services/auth.server";
import { getFormString } from "~/util/getFormString";

export const meta: MetaFunction = () => {
    return [
        { title: "Edit Link - Regex Zone" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const { searchParams } = new URL(request.url);

    const rxl_id = searchParams.get("rxl_id");
    if (!rxl_id) {
        //LATER: flash error
        return redirect("/links/");
    }
    
    const links = await db.select().from(regex_link).where(eq(regex_link.rxl_id, rxl_id));
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
    console.log("updating link 1", JSON.stringify(formData));
    const rxl_id = getFormString(formData.get("rxl_id"));
    if (!rxl_id) {
        //LATER: flash error
        return redirect("/links/");
    }

    console.log("updating link 2", rxl_id, JSON.stringify(formData));
    const links = await db.select().from(regex_link).where(eq(regex_link.rxl_id, rxl_id));
    if (!links || links.length != 1) {
        //LATER: flash error
        return redirect("/links/");
    }

    console.log("updating link 3", rxl_id, JSON.stringify(formData));
    const user = await authenticator.isAuthenticated(request);
    if (!user || !user.isAdmin) {
        //LATER: flash error
        return redirect("/links/");
    }

    console.log("updating link 4", rxl_id, getFormString(formData.get("rxl_title")));

    await db.update(regex_link).set({
        rxl_url: getFormString(formData.get("rxl_url")),
        rxl_title: getFormString(formData.get("rxl_title")),
        rxl_tags: getFormString(formData.get("rxl_tags")).split(' '),
        rxl_updated_at: new Date(),
    }).where(eq(regex_link.rxl_id, rxl_id));

    //LATER: flash success
    return redirect("/links/");
}

export default function Index() {
    const data = useLoaderData<typeof loader>();

    console.log("func message", JSON.stringify(data));

    const theLink = data.link;

    return (
        <>
            <h1 className="py-2">Edit Link</h1>
            <form method="post">
                <input type="hidden" name="rxl_id" value={theLink.rxl_id} />
                <div className="mb-3">
                    <label htmlFor="rxl_url" className="form-label">URL</label>
                    <input type="text" className="form-control" id="rxl_url" name="rxl_url" defaultValue={theLink.rxl_url} />
                </div>
                <div className="mb-3">
                    <label htmlFor="rxl_title" className="form-label">Text</label>
                    <input type="text" className="form-control" id="rxl_title" name="rxl_title" defaultValue={theLink.rxl_title} />
                </div>
                <div className="mb-3">
                    <label htmlFor="rxl_tags" className="form-label">Tags</label>
                    <input type="text" className="form-control" id="rxl_tags" name="rxl_tags" defaultValue={theLink.rxl_tags.join(' ')} />
                </div>
                <div className="mb-3">
                    <label htmlFor="rxl_created" className="form-label">Created</label>
                    <input type="text" className="form-control" id="rxl_created" defaultValue={theLink.rxl_created_at} disabled readOnly />
                </div>
                <div className="mb-3">
                    <label htmlFor="rxl_updated" className="form-label">Updated</label>
                    <input type="text" className="form-control" id="rxl_updated" defaultValue={theLink.rxl_updated_at} disabled readOnly />
                </div>
                <input type="submit" className="btn btn-primary" value="Save" />
                <RemixLink className="btn btn-outline-primary mx-2" to="/links/">Cancel</RemixLink>
            </form>
        </>
    );
}