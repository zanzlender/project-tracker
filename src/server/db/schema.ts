// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { create } from "domain";
import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  primaryKey,
  json,
  serial,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `project-tracker_${name}`);

export const users = createTable("users", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`gen_random_uuid()`),
  name: text("name").notNull(),
  username: varchar("username", { length: 256 }).notNull(),
  email: text("email").unique(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
  memberOfProjects: many(projects_users),
  invitedUsersToProject: many(projects_invites, {
    relationName: "inviterRelation",
  }),
  invitedToProjects: many(projects_invites, {
    relationName: "inviteeRelation",
  }),
  createdTasks: many(project_tasks),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

type Actions = "A" | "B";

export const projects = createTable(
  "projects",
  {
    id: text("id")
      .primaryKey()
      .$default(() => sql`gen_random_uuid()`),
    name: varchar("name", { length: 256 }),
    description: text("description").notNull(),
    authorId: text("author_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.authorId], references: [users.id] }),
  members: many(projects_users),
  invites: many(projects_invites),
  tasks: many(project_tasks),
}));

export type InsertProject = typeof projects.$inferInsert;
export type SelectProject = typeof projects.$inferSelect;

type Roles = "OWNER" | "MEMBER";

export const projects_users = createTable(
  "projects_users",
  {
    userId: text("user_id").notNull(),
    projectId: text("project_id").notNull(),
    role: text("role").$type<Roles>().notNull(),
    allowedActions: text("allowed_actions").$type<Actions>().array().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.projectId] }),
    };
  },
);

export const projectsUsersRelations = relations(projects_users, ({ one }) => ({
  user: one(users, { fields: [projects_users.userId], references: [users.id] }),
  project: one(projects, {
    fields: [projects_users.projectId],
    references: [projects.id],
  }),
}));

export type InsertProjectUser = typeof projects_users.$inferInsert;
export type SelectProjectUser = typeof projects_users.$inferSelect;

export const projects_invites = createTable("projects_invites", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`gen_random_uuid()`),
  projectId: text("project_id").notNull(),
  inviteeId: text("invitee_id").notNull(),
  inviterId: text("inviter_id").notNull(),
  role: text("role").$type<Roles>().notNull(),
  allowedActions: text("allowed_actions").$type<Actions>().array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const projectsInvitesRelations = relations(
  projects_invites,
  ({ one }) => ({
    inviter: one(users, {
      fields: [projects_invites.inviterId],
      references: [users.id],
      relationName: "inviterRelation",
    }),
    invitee: one(users, {
      fields: [projects_invites.inviteeId],
      references: [users.id],
      relationName: "inviteeRelation",
    }),
    project: one(projects, {
      fields: [projects_invites.projectId],
      references: [projects.id],
    }),
  }),
);

export type InsertProjectInvites = typeof projects_invites.$inferInsert;
export type SelectProjectInvites = typeof projects_invites.$inferSelect;

export const project_tasks = createTable("project_tasks", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`gen_random_uuid()`),
  authorId: text("author_id").notNull(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  badges: text("badges").array(),
  column: text("column").notNull(),
});

export type InsertProjectTask = typeof project_tasks.$inferInsert;
export type SelectProjectTask = typeof project_tasks.$inferSelect;

export const projectTasksRelations = relations(project_tasks, ({ one }) => ({
  author: one(users, {
    fields: [project_tasks.authorId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [project_tasks.projectId],
    references: [projects.id],
  }),
}));

export const project_columns = createTable("project_task_columns", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`gen_random_uuid()`),
  name: text("name").notNull(),
  projectId: text("project_id").notNull(),
});
