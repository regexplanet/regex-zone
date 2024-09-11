import type { MetaFunction } from "@remix-run/node";
import { Container } from 'react-bootstrap';
import { isRouteErrorResponse, Link as RemixLink, Links, Meta, Scripts, useRouteError } from "@remix-run/react";

import { ColorSchemeToggle } from "~/components/ColorSchemeToggle/ColorSchemeToggle";
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
      <HeaderSearch />
      <Container>
        <h1 className="py-2">
          Welcome to the Regex Zone
        </h1>
        <div className="pb-3">Check out the <RemixLink to="/library/">Library</RemixLink> of useful patterns!</div>
        <ColorSchemeToggle />
        </Container>
        <Footer />
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
        <h1>xx
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
              ? error.message
              : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}

