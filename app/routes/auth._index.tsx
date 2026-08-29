import { LoaderFunctionArgs, useLoaderData } from "react-router";
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
		providers: authenticator.providers,
		session: (await cookieStorage.getSession(request.headers.get("Cookie")))
	};
}

function LoginSection({ providers }: { providers: typeof authenticator.providers }) {
	return (
		<>
			<p>You are not logged in!</p>
			<div className="d-flex gap-2">
				{providers.filter((provider) => provider.isEnabled).map((provider) => (
					<form action={`/auth/${provider.id}`} method="post" key={provider.id}>
						<button type="submit" className="btn btn-primary">Log in with {provider.name}</button>
					</form>
				))}
			</div>
		</>
	)
}

function LogoutSection({ user }: { user: User }) {
	return (
		<>
			<div className="mb-3 col-lg-5">
				<label htmlFor="providerName">Logged in via</label>
				<div className="border rounded bg-body-tertiary text-body-secondary p-2" id="profileName">{user.providerName}</div>
			</div>
			<div className="mb-3 col-lg-5">
				<label htmlFor="displayName">Name</label>
				<div className="border rounded bg-body-tertiary text-body-secondary p-2" id="displayName">{user.displayName}</div>
			</div>
			<div className="mb-3 col-lg-5">
				<label htmlFor="email">Email</label>
				<div className="border rounded bg-body-tertiary text-body-secondary p-2" id="email">{user.email}</div>
			</div>
			{user.isAdmin && (
				<div className="mb-3">
					<label className="mt-3 d-flex align-items-center gap-2">
						<input type="checkbox" checked readOnly />
						Admin
					</label>
				</div>
			)}
			<div className="mb-3 d-flex flex-column">
				<label htmlFor="avatar">Avatar image</label>
				<div className="align-self-start border rounded bg-body-tertiary text-body-secondary p-4" id="avatar"><img className="px-2" src={user.avatar} alt={user.displayName} style={{ "height": "4em" }} /></div>
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
			{data.user ? <LogoutSection user={data.user} /> : <LoginSection providers={data.providers} />}
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
