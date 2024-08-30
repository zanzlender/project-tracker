DO $$ BEGIN
 ALTER TABLE "project-tracker_projects_users" ADD CONSTRAINT "project-tracker_projects_users_user_id_project-tracker_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."project-tracker_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project-tracker_projects_users" ADD CONSTRAINT "project-tracker_projects_users_project_id_project-tracker_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project-tracker_projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
