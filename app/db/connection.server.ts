import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { processEnvOrThrow } from "~/util/processEnvOrThrow.server";

function connect() {
    const url_str = processEnvOrThrow("DB_URL");
    const password = processEnvOrThrow("DB_PASSWORD");
    
    const url = new URL(url_str);
    url.password = password;

    return postgres(url.toString(), {
        ssl: "require",
        connection: {
            application_name: "regex-zone",
        }
    });
}
const dbconnection = connect();

const dborm = drizzle(dbconnection, { schema });

export { dbconnection, dborm };