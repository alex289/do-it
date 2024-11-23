'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Task } from '@/lib/mockData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TaskListProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
}

export default function TaskList({ tasks, updateTask, deleteTask }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<'all' |'low' | 'medium' | 'high' | null>(null)
  const [sizeFilter, setSizeFilter] = useState<'all' |'small' | 'medium' | 'large' | null>(null)

  const handleComplete = (task: Task, isCompleted: boolean) => {
    updateTask({ ...task, isCompleted })
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!categoryFilter || task.category === categoryFilter) &&
    (!priorityFilter || task.priority === priorityFilter) &&
    (!sizeFilter || task.size === sizeFilter)
  )

  const categories = Array.from(new Set(tasks.map(task => task.category)))

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={categoryFilter || ''} onValueChange={(value) => value === "all" ? setCategoryFilter(null) : setCategoryFilter(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter || ''} onValueChange={(value: 'all' |"low" | "medium" | "high") => value === "all" ? setPriorityFilter(null) : setPriorityFilter(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sizeFilter || ''} onValueChange={(value: 'all' |"medium" | "small" | "large") => value === "all" ? setSizeFilter(null) : setSizeFilter(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All sizes</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ul className="space-y-4">
        {filteredTasks.map(task => (
          <li key={task.id} className="flex flex-col p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={task.isCompleted}
                  onCheckedChange={(checked) => handleComplete(task, checked as boolean)}
                />
                <span className={task.isCompleted ? 'line-through' : ''}>{task.title}</span>
              </div>
              <Button variant="destructive" onClick={() => deleteTask(task.id)}>Delete</Button>
            </div>
            <p className="mt-2 text-sm text-gray-600">{task.description}</p>
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>Category: {task.category}</span>
              <span>Due: {task.dueDate ? task.dueDate.toLocaleDateString() : 'Not set'}</span>
              <span>Priority: {task.priority}</span>
              <span>Size: {task.size}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

