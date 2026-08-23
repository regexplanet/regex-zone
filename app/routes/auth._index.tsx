import { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
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
            <div className="d-flex gap-2">
                <form action="/auth/github" method="post">
                    <button type="submit" className="btn btn-primary">Log in with GitHub</button>
                </form>
                <form action="/auth/gitlab" method="post">
                    <button type="submit" className="btn btn-primary">Log in with GitLab</button>
                </form>
            </div>
        </>
    )
}

function LogoutSection({ user }: { user: User }) {
    return (
        <>
            <div class="mb-3 col-lg-5">
				<label>Logged in via</label>
				<div className="border rounded bg-body-tertiary text-body-secondary p-2">{user.providerName}</div>
			</div>
            <div class="mb-3 col-lg-5">
				<label>Name</label>
				<div className="border rounded bg-body-tertiary text-body-secondary p-2">{user.displayName}</div>
			</div>
            <div class="mb-3 col-lg-5">
				<label>Email</label>
				<div className="border rounded bg-body-tertiary text-body-secondary p-2">{user.email}</div>
			</div>
            {user.isAdmin && (
	            <div class="mb-3">
					<label className="mt-3 d-flex align-items-center gap-2">
						<input type="checkbox" checked readOnly />
						Admin
					</label>
				</div>
            )}
            <div class="mb-3 d-flex flex-column">
				<label>Avatar image</label>
				<div className="align-self-start border rounded bg-body-tertiary text-body-secondary p-4"><img className="px-2" src={user.avatar} alt={user.displayName} style={{"height":"4em"}} /></div>
			</div>
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
