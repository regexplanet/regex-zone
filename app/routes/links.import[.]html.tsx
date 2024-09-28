import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { User } from "~/types/User";
import {
    ActionFunctionArgs,
    redirect,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { adminOnlyLoader } from "~/util/adminOnlyLoader";
import { Form } from "@remix-run/react";

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

    const user:User|null = await authenticator.isAuthenticated(request);
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

    console.log("formDataValue", formDataValue);

    const textData = await dataBlob.text();

    console.log("data", textData.length);

    let jsonData = JSON.parse(textData) as PinboardEntry[];

    jsonData = jsonData.filter(entry => entry.tags.indexOf("regex") !== -1);
    for (const entry of jsonData) {
        console.log(JSON.stringify(entry));
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