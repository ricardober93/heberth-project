CREATE TABLE IF NOT EXISTS "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(256),
	"content" varchar(256)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "notes" USING btree ("user_id");