import { sql } from "drizzle-orm";
import {
  timestamp,
  index,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const regex_link = pgTable(
  "regex_link",
  {
    rxl_id: text("rxl_id")
      .notNull()
      .primaryKey()
      .default(sql`CONCAT('rxl_', gen_random_uuid()::VARCHAR)`),
    rxl_created_at: timestamp("rxl_created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    rxl_updated_at: timestamp("rxl_updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    rxl_title: text("rxl_title").notNull(),
    rxl_url: text("rxl_url").notNull(),
    rxl_cached: jsonb("rxl_cached")
      .notNull()
      .default(sql`'{}'::jsonb`),
    rxl_tags: text("rxl_tags")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`).$type<string[]>(),
  },
  (table) => ({
    rxl_created_at_idx: index("created_at_idx").on(table.rxl_created_at),
    rxl_url_idx: uniqueIndex("rxl_url_idx").on(table.rxl_url),
  })
);
