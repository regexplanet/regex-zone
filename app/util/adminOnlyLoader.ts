import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function adminOnlyLoader({ request }: { request: Request }) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    const url = new URL(request.url);
    //LATER: should be .path, but it's not available in the type definition
    return redirect(`/auth/?nextx=${encodeURIComponent(url.pathname)}`);
  }
  if (!user.isAdmin) {
    throw new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }
  return user;
}
