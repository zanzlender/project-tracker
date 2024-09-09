import { z } from "zod";

export const UpdateTaskSchema = z.object({
  id: z.string(),
  column: z.string(),
  description: z.string(),
  title: z.string(),
  badges: z.array(z.string()),
});

const columnSchema = z.object({
  id: z.string(),
  title: z.string(),
  tasks: z.array(
    z.object({
      id: z.string(),
      column: z.string(),
      description: z.string(),
      title: z.string(),
      badges: z.array(z.string()),
      position: z.number(),
    }),
  ),
});

export const updateAllColumnsSchema = z.array(columnSchema);

export const UpdateTasksSchema = z.array(
  z.object({
    id: z.string(),
    column: z.string(),
    description: z.string(),
    title: z.string(),
    badges: z.array(z.string()),
  }),
);
