import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader() {
  return redirect("/auth/");
}

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("github", request, {
    successRedirect: "/auth/",
    failureRedirect: "/auth/",
  });
}