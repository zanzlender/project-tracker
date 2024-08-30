CREATE TABLE IF NOT EXISTS "project-tracker_projects_invites" (
	"id" text PRIMARY KEY NOT NULL,
	"inviter_id" text NOT NULL,
	"invitee_id" text NOT NULL,
	"project_id" text NOT NULL,
	"role" text NOT NULL,
	"allowed_actions" text[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project-tracker_projects" DROP CONSTRAINT "project-tracker_projects_author_id_project-tracker_users_id_fk";
--> statement-breakpoint
ALTER TABLE "project-tracker_projects_users" DROP CONSTRAINT "project-tracker_projects_users_user_id_project-tracker_users_id_fk";
--> statement-breakpoint
ALTER TABLE "project-tracker_projects_users" DROP CONSTRAINT "project-tracker_projects_users_project_id_project-tracker_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project-tracker_projects" ALTER COLUMN "author_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project-tracker_projects_users" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project-tracker_projects_users" ALTER COLUMN "project_id" SET NOT NULL;