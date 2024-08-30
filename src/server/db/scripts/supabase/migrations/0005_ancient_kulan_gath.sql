ALTER TABLE "project-tracker_users" ADD COLUMN "username" varchar(256);--> statement-breakpoint
ALTER TABLE "project-tracker_projects" DROP COLUMN IF EXISTS "username";