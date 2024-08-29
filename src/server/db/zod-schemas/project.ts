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
