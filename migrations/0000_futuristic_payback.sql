CREATE TABLE IF NOT EXISTS "regex_link" (
	"rxl_id" text PRIMARY KEY DEFAULT CONCAT('rxl_', gen_random_uuid()::VARCHAR) NOT NULL,
	"rxl_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rxl_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rxl_title" text NOT NULL,
	"rxl_url" text NOT NULL,
	"rxl_cached" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"rxl_tags" text[] DEFAULT ARRAY[]::text[] NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "regex_link" USING btree ("rxl_created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rxl_url_idx" ON "regex_link" USING btree ("rxl_url");