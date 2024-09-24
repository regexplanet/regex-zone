import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { cookieStorage } from "~/services/session.server";
import { authenticator } from "~/services/auth.server";

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

  // don't pass request.headers.get("cookie") here
  let session = await cookieStorage.getSession(request.headers.get("Cookie"));

  const user = session.get("user");
  session = await cookieStorage.getSession();   // create empty session for flash msg
  let message:AlertMessage;
  if (user) {
    message = { alert: "success", text: "You have been logged out" };
  } else {
    message = { alert: "error", text: "You were not logged in"};
  }
  session.flash("logout", message);

  await authenticator.logout(request, {
    redirectTo: "/auth/logout.html",
    headers: { "Set-Cookie": await cookieStorage.commitSession(session) },
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
        <RemixLink className="btn btn-primary mx-2" to="/auth/">Login</RemixLink>
        <RemixLink className="btn btn-primary mx-2" to="/">Home</RemixLink>
      </p>
    </>
  );
}
