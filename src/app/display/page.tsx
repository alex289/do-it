'use client';

import { useSearchParams } from 'next/navigation';

import Charts from '@/components/Charts';
import PieChart from '@/components/PieChart';
import { mockTasks, Task } from '@/lib/mockData';

export default function DisplayPage() {
  const searchParams = useSearchParams();
  const showChart = searchParams.get('chart') !== 'false';

  return (
    <div className="space-y-8">
      <TaskDisplay tasks={mockTasks} />
      {showChart && (
        <div className="flex justify-between">
          <PieChart tasks={mockTasks} />
          <Charts tasks={mockTasks} />
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
