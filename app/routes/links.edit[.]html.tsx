import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link as RemixLink, redirect, useLoaderData, useSearchParams } from "@remix-run/react";
import { eq } from "drizzle-orm"
import { PiArrowSquareOut } from "react-icons/pi";

import { dborm } from "~/db/connection.server";
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

    const next = getFormString(formData.get("next")) || "/links/";

    const rxl_id = getFormString(formData.get("rxl_id"));
    if (!rxl_id) {
        //LATER: flash error
        return redirect(next);
    }

    const links = await dborm.select().from(regex_link).where(eq(regex_link.rxl_id, rxl_id));
    if (!links || links.length != 1) {
        //LATER: flash error
        return redirect(next);
    }

    const user = await authenticator.isAuthenticated(request);
    if (!user || !user.isAdmin) {
        //LATER: flash error
        return redirect(next);
    }

    const tags = getFormString(formData.get("rxl_tags")).split(' ').map(tag => tag.trim()).filter(tag => tag != "");  

    await dborm.update(regex_link).set({
        rxl_url: getFormString(formData.get("rxl_url")),
        rxl_title: getFormString(formData.get("rxl_title")),
        rxl_tags: tags,
        rxl_updated_at: new Date(),
    }).where(eq(regex_link.rxl_id, rxl_id));

    //LATER: flash success
    return redirect(next);
}

export default function Index() {
    const data = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const next = searchParams.get("next") || "/links/";

    const theLink = data.link as unknown as typeof regex_link.$inferSelect;

    return (
        <>
            <h1 className="py-2">Edit Link</h1>
            <form method="post">
                <input type="hidden" name="rxl_id" value={theLink.rxl_id} />
                <input type="hidden" name="next" value={next} />
                <div className="mb-3">
                    <label htmlFor="rxl_url" className="form-label">URL <a className="ms-2" href={theLink.rxl_url} target="_new">open<PiArrowSquareOut className="ms-1"/></a></label>
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
                <RemixLink className="btn btn-outline-primary mx-2" to={next}>Cancel</RemixLink>
            </form>
        </>
    );
}