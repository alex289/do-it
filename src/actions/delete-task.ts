'use server';

import { db } from '@/db';
import { task } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { deleteTaskSchema } from './schemas';

export const deleteTask = actionClient
  .schema(deleteTaskSchema)
  .action(async ({ parsedInput: { id } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: 'Not authenticated' };
    }

    const currentTask = await db.query.task.findFirst({
      where: eq(task.id, id),
    });

    if (!currentTask) {
      return { error: 'Task not found' };
    }

    if (currentTask.userId !== session.user.id) {
      return { error: 'You are not authorized to delete this task' };
    }

    await db.delete(task).where(eq(task.id, id));

    revalidatePath('/');
    return { success: true };
  });
