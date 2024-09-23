import type { MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, Link as RemixLink, Links, Meta, Scripts, useRouteError } from "@remix-run/react";

import { HeaderSearch } from "~/components/HeaderSearch/HeaderSearch";
import { Footer } from "~/components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Regex Zone" },
    { name: "description", content: "Useful regular expression resources" },
  ];
};

export default function Index() {
  return (
    <>
        <h1 className="py-2">
          Welcome to the Regex Zone
        </h1>
        <div className="pb-3">Check out the collection of useful <RemixLink to="/patterns/">Regular Expression Patterns</RemixLink>!</div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <HeaderSearch />
        <div className="container-lg">
        <h1>xx
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
              ? error.message
              : "Unknown Error"}
        </h1>
        <Scripts />
        </div>
        <Footer />
      </body>
    </html>
  );
}

