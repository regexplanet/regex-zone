import {
    ActionFunctionArgs, 
    LoaderFunctionArgs, 
    MetaFunction,
    redirect,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { authenticator } from "~/services/auth.server";
import { adminOnlyLoader } from "~/util/adminOnlyLoader";
import { User } from "~/types/User";

type PinboardEntry = {
    href: string;
    description: string;
    time: string;
    tags: string;
};

export const meta: MetaFunction = () => {
    return [
        { title: "Import Links - Regex Zone" },
        { name: "description", content: "Import JSON link dump from Pinboard.in" },
    ];
};

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    console.log("import action");

    const user: User | null = await authenticator.isAuthenticated(request);
    if (!user) {
        return redirect("/auth/");
    }
    if (!user.isAdmin) {
        throw new Response("Unauthorized", { status: 401 });
    }

    const formData = await unstable_parseMultipartFormData(
        request,
        unstable_createMemoryUploadHandler({
            maxPartSize: 50_000_000,
        })
    );

    const formDataValue = formData.get("file");
    if (!formDataValue) {
        throw new Response("No file uploaded", { status: 400 });
    }

    const dataBlob = formDataValue as Blob;

    const textData = await dataBlob.text();

    console.log("data length", textData.length);

    let jsonData = JSON.parse(textData) as PinboardEntry[];

    jsonData = jsonData.filter(entry => entry.tags.indexOf("regex") !== -1);
    for (const entry of jsonData) {
        console.log(JSON.stringify(entry));
        const existing = await dborm.select().from(regex_link).where(eq(regex_link.rxl_url, entry.href));
        if (existing.length > 0) {
            console.log(`found ${entry.href}, stopping...`);
            break;
        }
        console.log("inserting", entry.href);
        await dborm.insert(regex_link).values({
            rxl_url: entry.href,
            rxl_title: entry.description,
            rxl_tags: entry.tags.split(' '),
            rxl_created_at: new Date(entry.time),
        });
    }

    const session = await cookieStorage.getSession(request.headers.get("Cookie"));
    session.flash("message", { type: 'info', message: `You uploaded ${jsonData.length} entries` });
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
    console.log("import loader");
    return adminOnlyLoader(args);
}

import type { ShouldRevalidateFunction } from "@remix-run/react";
import { cookieStorage } from "~/services/session.server";
import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";

export const shouldRevalidate: ShouldRevalidateFunction = (params) => {
    console.log("shouldRevalidate", params);
    return params.defaultShouldRevalidate;
};

export default function Import() {

    return (
        <>
            <h1 className="py-2">Import Links</h1>
            <div className="d-flex justify-content-center">
                <Form method="post" className="border p-3" action="/links/import.html" encType="multipart/form-data">
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Pinboard.in Export JSON</label>
                        <input className="form-control" type="file" id="file" name="file" />
                    </div>
                    <button type="submit" className="btn btn-primary">Import</button>
                </Form>
            </div>
        </>
    );
}