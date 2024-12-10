import { db } from '@/db';
import { task } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import CategoryCharts from '@/components/category-chart';
import TaskStatusChart from '@/components/task-status-chart';
import { auth } from '@/lib/auth';

import type { Task } from '@/db/types';

export default async function DisplayPageWrapper({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const showChart = (await searchParams).chart;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }
  return (
    <DisplayPage userId={session.user.id} showChart={showChart !== 'false'} />
  );
}

async function DisplayPage({
  userId,
  showChart,
}: {
  userId: string;
  showChart: boolean;
}) {
  const tasks = await db.query.task.findMany({
    where: eq(task.userId, userId),
  });

  return (
    <div className="space-y-8">
      <TaskDisplay tasks={tasks} />
      {showChart && (
        <div className="flex justify-between">
          <TaskStatusChart tasks={tasks} />
          <CategoryCharts tasks={tasks} />
        </div>
      )}
    </div>
  );
}

function TaskDisplay({ tasks }: { tasks: Task[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      {tasks.filter((task) => !task.isCompleted).length === 0 ? (
        <p>No open tasks.</p>
      ) : null}
      <ul className="space-y-2">
        {tasks
          .filter((task) => !task.isCompleted)
          .map((task) => (
            <li
              key={task.id}
              className="p-2 bg-white dark:bg-black rounded shadow">
              <span className={task.isCompleted ? 'line-through' : ''}>
                {task.title}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({task.category})
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
