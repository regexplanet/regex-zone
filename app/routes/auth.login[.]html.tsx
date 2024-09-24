import { LoaderFunctionArgs } from "@remix-run/node";
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
    return await authenticator.isAuthenticated(request);
}

export default function AuthIndex() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <h1 className="py-2">Login</h1>
            { data ? <div className="alert alert-warning">It looks like you are already logged in! <RemixLink className="alert-link" to="/auth/">View my user info</RemixLink></div> : <></> }
            <form action="/auth/github" method="post">
                <button type="submit" className="btn btn-primary">Login with Github</button>
            </form>
        </>
    )
}