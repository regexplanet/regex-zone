import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { cookieStorage } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.authenticate("github", request);

  console.log('user in callback', JSON.stringify(user));
  if (user != null) {
    const session = await cookieStorage.getSession(request.headers.get("Cookie"));
    session.set("user", user);
    return redirect('/auth/', { headers: { "Set-Cookie": await cookieStorage.commitSession(session) }});
  }
  return redirect("/auth/");

  /*
  return authenticator.authenticate("github", request, {
    successRedirect: "/auth/sucess.html",
    failureRedirect: "/auth/failure.html",
  });
  */
}