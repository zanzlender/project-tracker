CREATE TABLE IF NOT EXISTS "project-tracker_project_task_columns" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"project_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project-tracker_projects" ADD COLUMN "content" json;