import { redirect, type LoaderFunctionArgs } from "react-router";

import { authenticator } from "~/services/auth.server";
import { cookieStorage } from "~/services/session.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const session = await authenticator.completeAuthentication(
    request,
    params.provider ?? ""
  );
  return redirect("/auth/", {
    headers: { "Set-Cookie": await cookieStorage.commitSession(session) },
  });
}
