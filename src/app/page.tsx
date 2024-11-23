'use client'

import { useState } from 'react'
import TaskDialog from '@/components/TaskDialog'
import TaskList from '@/components/TaskList'
import CategoryList from '@/components/CategoryList'
import Charts from '@/components/Charts'
import PieChart from '@/components/PieChart'
import { Task, mockTasks } from '@/lib/mockData'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks(prevTasks => [
      ...prevTasks,
      {
        ...newTask,
        id: Math.max(...prevTasks.map(t => t.id)) + 1,
        createdAt: new Date()
      }
    ])
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
  }

  const categories = Array.from(new Set(tasks.map(task => task.category)))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <TaskDialog addTask={addTask} categories={categories} />
        <TaskList tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} />
      </div>
      <div className="space-y-8">
        <CategoryList tasks={tasks} />
        <PieChart tasks={tasks} />
        <Charts tasks={tasks} />
      </div>
    </div>
  )
}

