import type { LoaderFunctionArgs } from "@remix-run/node";
import { handleJsonp } from "~/util/handleJsonp";

export async function loader({
    request,
}: LoaderFunctionArgs) {

    const jsonStr = JSON.stringify({
        success: true,
        message: 'OK',
        timestamp: new Date().toISOString(),
        tech: `NodeJS ${process.version}`,
        lastmod: process.env.LASTMOD || '(not set)',
        commit: process.env.COMMIT || '(not set)',
    });

    return handleJsonp(request, jsonStr);
}
