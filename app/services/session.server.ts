import { createCookieSessionStorage } from "@remix-run/node";
import { processEnvOrThrow } from "~/util/processEnvOrThrow.server";

// export the whole sessionStorage object
const cookieStorage = createCookieSessionStorage({
  cookie: {
    name: "_jsessionid", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [processEnvOrThrow("COOKIE_SECRET")], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
const { getSession, commitSession, destroySession } = cookieStorage;

export { getSession, commitSession, destroySession, cookieStorage };