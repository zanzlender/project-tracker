ALTER TABLE "project-tracker_projects_invites" DROP CONSTRAINT "project-tracker_projects_invites_project_id_invitee_id_pk";--> statement-breakpoint
ALTER TABLE "project-tracker_projects_invites" ADD COLUMN "id" text PRIMARY KEY NOT NULL;