import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(5, {
    message: "The project's name should be at least 5 characters long",
  }),
  description: z.string().min(5, {
    message:
      "A short project description is required, write at least 10 characters",
  }),
});

export const updateProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(5, {
    message: "The project's name should be at least 5 characters long",
  }),
  description: z.string().min(5, {
    message:
      "A short project description is required, write at least 10 characters",
  }),
});

export const createTaskSchema = z.object({
  title: z.string().min(5, {
    message: "The project's name should be at least 5 characters long",
  }),
  column: z.string(),
  description: z.string(),
  projectId: z.string(),
  badges: z.array(z.string()),
});
