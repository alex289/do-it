'use server';

import { db } from '@/db';
import { task } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { createTaskSchema } from './schemas';

export const createTask = actionClient
  .schema(createTaskSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: 'Not authenticated' };
    }

    const id = crypto.randomUUID();
    await db.insert(task).values({
      ...parsedInput,
      id: crypto.randomUUID(),
      userId: session.user.id,
      createdAt: new Date(),
    });

    revalidatePath('/');
    return { id };
  });
