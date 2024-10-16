import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { cookieStorage } from "~/services/session.server";
import { User } from "~/types/User";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await cookieStorage.getSession(request.headers.get("Cookie"));
    const sessionUser = session.get("user");
    const authUser = await authenticator.isAuthenticated(request);
    return {
        user: authUser,
        sessionUser,
        authUser,
        session: (await cookieStorage.getSession(request.headers.get("Cookie")))
    };
}

function LoginSection() {
    return (
        <>
            <p>You are not logged in!</p>
            <form action="/auth/github" method="post">
                <button type="submit" className="btn btn-primary">Login with Github</button>
            </form>
        </>
    )
}

function LogoutSection({ user }: { user: User }) {
    return (
        <>
            <p>You are logged in as <span className="border rounded bg-body-tertiary text-body-secondary p-2">{user.displayName} ({user.providerName}@{user.provider})</span></p>
            <p>Your email is <span className="border rounded bg-body-tertiary text-body-secondary p-2">{user.email}</span></p>
            <p>Your profile image is <img className="px-2" src={user.avatar} alt={user.displayName} style={{"height":"2em"}} /></p>
            <form action="/auth/logout.html" method="post">
                <input type="submit" className="btn btn-primary" value="Logout" />
            </form>
        </>
    )
}

export default function AuthIndex() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <h1 className="py-2">Authentication</h1>
            { data.user ? <LogoutSection user={data.user} /> : <LoginSection/> }
            <details className="pt-3">
                <summary>Raw Auth User Data</summary>
                <pre>{JSON.stringify(data.user, null, 4)}</pre>
            </details>
            <details className="">
                <summary>Raw Session User Data</summary>
                <pre>{JSON.stringify(data.user, null, 4)}</pre>
            </details>
            <details>
                <summary>Raw Session Data</summary>
                <pre>{JSON.stringify(data.session, null, 4)}</pre>
            </details>
        </>
    )
}