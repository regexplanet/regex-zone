import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request);
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <Meta />
        <Links />
        <style>{`
          html, body {
            min-height: 100%;
          }
          xfooter { bottom: 0; position: fixed;}
          `}
        </style>
      </head>
      <body>
        <Navbar />
        <div className="container-lg">
          {children}
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
      <Outlet />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <>
      <h1 className="py-2">Error</h1>
      <div>
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
            ? error.message
            : "Unknown Error"}
      </div>
    </>
  );
}
