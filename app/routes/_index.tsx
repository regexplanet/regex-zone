import type { MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, Link as RemixLink, Links, Meta, Scripts, useRouteError, useLoaderData, json } from "@remix-run/react";
import { desc } from "drizzle-orm";

import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { regex_link } from "~/db/schema";
import { dborm } from "~/db/connection.server";
import LinksTable from "~/components/LinksTable";

export const meta: MetaFunction = () => {
  return [
    { title: "Regex Zone" },
    { name: "description", content: "Useful regular expression resources" },
  ];
};

export async function loader() {
  const links = await dborm.select().from(regex_link).orderBy(desc(regex_link.rxl_created_at)).limit(8);
  return json( { links } );
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const links = data.links as unknown as typeof regex_link.$inferSelect[];

  return (
    <>
        <h1 className="py-2">
          Welcome to the Regex Zone
        </h1>
        <div className="pb-3">Check out the collection of useful <RemixLink to="/patterns/">Regular Expression Patterns</RemixLink>!</div>
        <hr />
        <h2>Recent Links</h2>
        <LinksTable currentUrl="/" links={links} isAdmin={false} />
        <RemixLink to="/links/" className="btn btn-sm btn-primary">More Links...</RemixLink>
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
        <Navbar />
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

