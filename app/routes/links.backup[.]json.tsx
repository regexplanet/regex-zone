import { desc } from "drizzle-orm";

import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";

export async function loader() {

    const links = await dborm.select().from(regex_link).orderBy(desc(regex_link.rxl_created_at));

    const jsonStr = JSON.stringify(links);

    const date = new Date().toISOString().split('T')[0];

    return new Response(jsonStr, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Max-Age': '604800',
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Disposition': `attachment; filename="${date}-backup_rz_links.json"`,
        },
    });
}
