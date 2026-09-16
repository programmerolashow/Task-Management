import { z } from "zod";

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"], {
  errorMap: () => ({ message: "Status must be TODO, IN_PROGRESS, or COMPLETED" }),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer")
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .nullable()
    .transform((val) => (val ? val.trim() : null)),
  status: taskStatusSchema.default("TODO"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Due date must be a valid date format",
    }),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
