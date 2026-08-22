import { ActionFunctionArgs, Link, LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { cookieStorage, destroySession } from "~/services/session.server";

type AlertMessage = {
  alert: string;
  text: string;
};

export async function loader({request}: LoaderFunctionArgs): Promise<AlertMessage | null> {
  const session = await cookieStorage.getSession(request.headers.get("Cookie"));

  const message = session.get("logout") as AlertMessage;

  console.log('logout message', JSON.stringify(message));
  //return logout(request);  logouts need to be POSTs
  return null;
}

export async function action({ request }: ActionFunctionArgs) {

  return redirect("/auth/logout.html", {
    headers: {
      "Set-Cookie": await destroySession(
        await cookieStorage.getSession(request.headers.get("Cookie"))
      ),
    },
  });
}

export default function AuthLogout() {
  const data = useLoaderData<typeof loader>();

  const message = data || { alert: "info", text: "You are logged out!" };

  return (
    <>
      <h1 className="py-2">Logout</h1>
      <p>{message.text}</p>
      <p>
        <Link className="btn btn-primary mx-2" to="/">Home</Link>
      </p>
    </>
  );
}
