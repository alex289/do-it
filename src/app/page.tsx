import { db } from '@/db';
import { task } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import CategoryCharts from '@/components/category-chart';
import CategoryList from '@/components/category-list';
import TaskDialog from '@/components/task-dialog';
import TaskFilter from '@/components/task-filter';
import TaskList from '@/components/task-list';
import TaskStatusChart from '@/components/task-status-chart';
import { auth } from '@/lib/auth';

export default async function HomeWrapper({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const category = (await searchParams).category;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return <Home userId={session.user.id} category={category?.toString()} />;
}

async function Home({
  userId,
  category,
}: {
  userId: string;
  category?: string;
}) {
  const tasks = await db.query.task.findMany({
    where: category
      ? and(eq(task.userId, userId), eq(task.category, category))
      : eq(task.userId, userId),
  });

  const categories = Array.from(new Set(tasks.map((task) => task.category)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <TaskDialog categories={categories} />
        <TaskFilter categories={categories} />
        <TaskList tasks={tasks} />
      </div>
      <div className="space-y-8">
        <CategoryList categories={categories} />
        <TaskStatusChart tasks={tasks} />
        <CategoryCharts tasks={tasks} />
      </div>
    </div>
  );
}
