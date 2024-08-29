// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  uuid,
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  text,
  primaryKey,
  json,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `project-tracker_${name}`);

export const users = createTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").notNull().unique(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

type Actions = "A" | "B";

export const projects = createTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }),
    description: text("description").notNull(),
    authorId: uuid("author_id").references(() => users.id),
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

export type InsertProject = typeof projects.$inferInsert;
export type SelectProject = typeof projects.$inferSelect;

export const projects_users = createTable(
  "projects_users",
  {
    userId: uuid("user_id"),
    projectId: uuid("project_id"),
    role: text("role").notNull(),
    allowedActions: text("allowed_actions").$type<Actions>().array().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.projectId] }),
    };
  },
);
export type InsertProjectUser = typeof projects_users.$inferInsert;
export type SelectProjectUser = typeof projects_users.$inferSelect;
