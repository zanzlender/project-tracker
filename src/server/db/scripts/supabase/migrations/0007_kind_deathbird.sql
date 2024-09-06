CREATE TABLE IF NOT EXISTS "project-tracker_project_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"project_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"badges" text[]
);
--> statement-breakpoint
ALTER TABLE "project-tracker_users" ALTER COLUMN "username" SET NOT NULL;