import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";

import { authenticator } from "~/services/auth.server";
import { cookieStorage } from "~/services/session.server";

export async function loader({ params }: LoaderFunctionArgs) {
  return redirect(`/auth/${params.provider ?? ""}`);
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { session, url } = await authenticator.beginAuthentication(
    request,
    params.provider ?? ""
  );
  return redirect(url, {
    headers: { "Set-Cookie": await cookieStorage.commitSession(session) },
  });
}
