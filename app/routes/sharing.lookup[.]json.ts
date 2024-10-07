import { LoaderFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";

import { dborm } from "~/db/connection.server";
import { regex_share } from "~/db/schema";
import { handleJsonp } from "~/util/handleJsonp";

export async function loader({ request }: LoaderFunctionArgs) {
    const { searchParams } = new URL(request.url);

    const share_code = searchParams.get("share");
    if (!share_code) {
        return handleJsonp(request, {
            success: false,
            message: "No share code provided",
        });
    }

    const theShares = await dborm.select().from(regex_share).where(eq(regex_share.rxs_share_code, share_code));

    if (!theShares || theShares.length != 1) {
        return handleJsonp(request, {
            success: false,
            message: `Share code "${share_code}" not found`,
            share: share_code,
        });
    }

    return handleJsonp(request, {
        success: true,
        share: share_code,
        regex: {
            title: theShares[0].rxs_title,
            regex: theShares[0].rxs_regex,
            replacement: theShares[0].rxs_replacement,
            inputs: theShares[0].rxs_inputs,
            options: theShares[0].rxs_options,
            //LATER: engines
        },
    });
}
