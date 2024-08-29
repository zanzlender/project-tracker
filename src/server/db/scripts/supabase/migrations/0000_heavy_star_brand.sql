CREATE TABLE IF NOT EXISTS "project-tracker_projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"description" text NOT NULL,
	"author_id" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project-tracker_projects_users" (
	"user_id" text,
	"project_id" text,
	"role" text NOT NULL,
	"allowed_actions" text[] NOT NULL,
	CONSTRAINT "project-tracker_projects_users_user_id_project_id_pk" PRIMARY KEY("user_id","project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project-tracker_users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"profile_image" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "project-tracker_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project-tracker_projects" ADD CONSTRAINT "project-tracker_projects_author_id_project-tracker_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."project-tracker_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "project-tracker_projects" USING btree ("name");