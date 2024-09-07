ALTER TABLE "project-tracker_project_tasks" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project-tracker_project_tasks" ADD COLUMN "column" text NOT NULL;