CREATE TABLE IF NOT EXISTS "regex_share" (
	"rxs_id" text PRIMARY KEY DEFAULT CONCAT('rxs_', gen_random_uuid()::VARCHAR) NOT NULL,
	"rxs_created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rxs_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rxs_share_code" text NOT NULL,
	"rxs_title" text,
	"rxs_regex" text NOT NULL,
	"rxs_replacement" text,
	"rxs_inputs" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"rxs_options" text[] DEFAULT ARRAY[]::text[] NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rxs_share_code_idx" ON "regex_share" USING btree ("rxs_share_code");