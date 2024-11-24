import { db } from '@/db';
import { Task } from '@/db/types';

import Charts from '@/components/charts';
import PieChart from '@/components/pie-chart';

export default async function DisplayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const showChart = (await searchParams).chart;
  const tasks = await db.query.task.findMany();

  return (
    <div className="space-y-8">
      <TaskDisplay tasks={tasks} />
      {showChart && (
        <div className="flex justify-between">
          <PieChart tasks={tasks} />
          <Charts tasks={tasks} />
        </div>
      )}
    </div>
  );
}

function TaskDisplay({ tasks }: { tasks: Task[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
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
