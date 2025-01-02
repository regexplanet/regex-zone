import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
    redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { parseFeed } from "@rowanmanning/feed-parser";

import { authenticator } from "~/services/auth.server";
import { adminOnlyLoader } from "~/util/adminOnlyLoader";
import { User } from "~/types/User";

export const meta: MetaFunction = () => {
    return [
        { title: "Import RSS/Atom Links - Regex Zone" },
        { name: "description", content: "Import JSON link dump from Pinboard.in" },
    ];
};

export const action = async ({
    request,
}: ActionFunctionArgs) => {

    const user: User | null = await authenticator.isAuthenticated(request);
    if (!user) {
        return redirect("/auth/");
    }
    if (!user.isAdmin) {
        throw new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();

    const formDataValue = formData.get("feedurl");
    if (!formDataValue) {
        throw new Response("No url specified", { status: 400 });
    }

    const feedUrl = formDataValue as string;
    try {
        new URL(feedUrl);
    } catch (e) {
        throw new Response("Invalid URL", { status: 400 });
    }

    const feedResponse = await fetch(feedUrl);
    if (!feedResponse.ok) {
        throw new Response("Error fetching feed", { status: 400 });
    }

    const feedtext = await feedResponse.text();
    let feed:Feed;

    try {
        feed = await parseFeed(feedtext);
    } catch (err: unknown) {
        throw new Response("Error parsing feed", { status: 400 });
    }

    let count = 0;
    for (const entry of feed.items) {
        const url = entry.url;
        if (!url) {
            continue;
        }
        const existing = await dborm.select().from(regex_link).where(eq(regex_link.rxl_url, url));
        if (existing.length > 0) {
            console.log(`found ${url}, stopping...`);
            break;
        }
        const values = {
            rxl_url: entry.url,
            rxl_title: entry.title || "(untitled)",
            rxl_tags: entry.categories[0].term.split(' '),
            rxl_created_at: new Date(entry.published || "1970-01-01T00:00:00Z"),
        }
        console.log(JSON.stringify(values, null, 2));
        await dborm.insert(regex_link).values(values);
        count++;
    }

    const session = await cookieStorage.getSession(request.headers.get("Cookie"));
    session.flash("message", { type: 'info', message: `You uploaded ${count} entries from ${feedUrl}!` });
    return redirect('/links/', { headers: { "Set-Cookie": await cookieStorage.commitSession(session) } });

    /**
     * LATER: it would be nice if Remix supported action responses but `shouldRevalidate` doesn't seem to work
     *
    console.log("about to return");
    return new Response(`You uploaded ${data.length} bytes`, {
        status: 200,
        headers: {
            'Content-type': "text/plain; charset=utf-8",
        }
    });
    */

};

export function loader(args: LoaderFunctionArgs) {
    const user = adminOnlyLoader(args);

    return {
        user,
        url: process.env.BOOKMARK_FEED_URL,
    }
}

import type { ShouldRevalidateFunction } from "@remix-run/react";
import { cookieStorage } from "~/services/session.server";
import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";
import { Feed } from "@rowanmanning/feed-parser/lib/feed/base";

export const shouldRevalidate: ShouldRevalidateFunction = (params) => {
    console.log("shouldRevalidate", params);    // never called
    return params.defaultShouldRevalidate;
};

export default function Import() {

    const data = useLoaderData<typeof loader>();

    const url = data.url;


    return (
        <>
            <h1 className="py-2">Import RSS/Atom Feed Links</h1>
            <div className="d-flex justify-content-center">
                <Form method="post" className="border p-3" action="/links/import-feed.html" encType="multipart/form-data">
                    <div className="mb-3">
                        <label htmlFor="feedurl" className="form-label">RSS/Atom Feed</label>
                        <input className="form-control" type="url" id="feedurl" name="feedurl" value={url}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Import</button>
                </Form>
            </div>
        </>
    );
}
