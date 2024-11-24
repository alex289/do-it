import { z } from 'zod';

export const deleteTaskSchema = z.object({
  id: z.string().uuid(),
});

export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  isCompleted: z.boolean(),
  dueDate: z.date().optional(),
  // Sqlite doesnt support enums
  // priority: z.enum(['low', 'medium', 'high']),
  // size: z.enum(['small', 'medium', 'large']),
  priority: z.string(),
  size: z.string(),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  isCompleted: z.boolean(),
  dueDate: z.date().optional(),
  // Sqlite doesnt support enums
  // priority: z.enum(['low', 'medium', 'high']),
  // size: z.enum(['small', 'medium', 'large']),
  priority: z.string(),
  size: z.string(),
});
