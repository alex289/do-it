'use server';

import { db } from '@/db';
import { task } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { updateTaskSchema } from './schemas';

export const updateTask = actionClient
  .schema(updateTaskSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: 'Not authenticated' };
    }

    const currentTask = await db.query.task.findFirst({
      where: eq(task.id, parsedInput.id),
    });

    if (!currentTask) {
      return { error: 'Task not found' };
    }

    if (currentTask.userId !== session.user.id) {
      return { error: 'You are not authorized to delete this task' };
    }

    await db
      .update(task)
      .set({
        ...parsedInput,
      })
      .where(eq(task.id, parsedInput.id));

    return { success: true };
  });
