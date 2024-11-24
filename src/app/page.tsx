import { db } from '@/db';
import { task } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import CategoryList from '@/components/category-list';
import Charts from '@/components/charts';
import PieChart from '@/components/pie-chart';
import TaskDialog from '@/components/task-dialog';
import TaskList from '@/components/task-list';
import { auth } from '@/lib/auth';

export default async function HomeWrapper() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return <Home userId={session.user.id} />;
}

export async function Home({ userId }: { userId: string }) {
  const tasks = await db.query.task.findMany({
    where: eq(task.userId, userId),
  });

  const categories = Array.from(new Set(tasks.map((task) => task.category)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <TaskDialog categories={categories} />
        <TaskList tasks={tasks} />
      </div>
      <div className="space-y-8">
        <CategoryList tasks={tasks} />
        <PieChart tasks={tasks} />
        <Charts tasks={tasks} />
      </div>
    </div>
  );
}
