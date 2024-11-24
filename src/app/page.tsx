'use client';

import { Task } from '@/db/types';
import { useState } from 'react';

import CategoryList from '@/components/category-list';
import Charts from '@/components/charts';
import PieChart from '@/components/pie-chart';
import TaskDialog from '@/components/task-dialog';
import TaskList from '@/components/task-list';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (newTask: Task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        ...newTask,
      },
    ]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const categories = Array.from(new Set(tasks.map((task) => task.category)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <TaskDialog addTask={addTask} categories={categories} />
        <TaskList
          tasks={tasks}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      </div>
      <div className="space-y-8">
        <CategoryList tasks={tasks} />
        <PieChart tasks={tasks} />
        <Charts tasks={tasks} />
      </div>
    </div>
  );
}
