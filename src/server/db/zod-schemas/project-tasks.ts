import { z } from "zod";

export const UpdateTaskSchema = z.object({
  id: z.string(),
  column: z.string(),
  description: z.string(),
  title: z.string(),
  badges: z.array(z.string()),
});

export const UpdateTasksSchema = z.array(
  z.object({
    id: z.string(),
    column: z.string(),
    description: z.string(),
    title: z.string(),
    badges: z.array(z.string()),
  }),
);
