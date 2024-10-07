import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { desc } from "drizzle-orm";
import Haikunator from "haikunator";

import { dborm } from "~/db/connection.server";
import { regex_share } from "~/db/schema";
import { authenticator } from "~/services/auth.server";
import { getFormString } from "~/util/getFormString";
import { handleJsonp } from "~/util/handleJsonp";

export async function loader({ request }: LoaderFunctionArgs) {

    if (request.method !== "POST") {
        return handleJsonp(request, { success: false, message: "Invalid request method" });
    }
}

export async function action({ request }: ActionFunctionArgs) {
    
    const user = await authenticator.isAuthenticated(request);

    const formData = await request.formData();

    const regex = getFormString(formData.get("regex"));
    if (!regex) {
        return handleJsonp(request, { success: false, message: "No regex provided" });
    }
    const haikunator = new Haikunator({ defaults: { tokenLength: 3 }});
    const share_code = haikunator.haikunate();


    await dborm.insert(regex_share).values({
        rxs_regex: regex,
        rxs_share_code: share_code,
        rxs_title: getFormString(formData.get("title")),
        rxs_replacement: getFormString(formData.get("replacement")),
        rxs_inputs: (formData.getAll("input") as string[]) || [],
        rxs_options: (formData.getAll("options") as string[]) || [],
    });

    return handleJsonp(request, { 
        success: true, 
        message: `Regex saved with share code: ${share_code}`,
        share: share_code 
    });
}