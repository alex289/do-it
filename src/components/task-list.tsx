'use client';

import { deleteTask } from '@/actions/delete-task';
import { updateTask } from '@/actions/update-task';
import { Task } from '@/db/types';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from './spinnter';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | 'low' | 'medium' | 'high' | null
  >(null);
  const [sizeFilter, setSizeFilter] = useState<
    'all' | 'small' | 'medium' | 'large' | null
  >(null);

  const filteredTasks = tasks
    .sort((a, b) =>
      a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1,
    )
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!categoryFilter || task.category === categoryFilter) &&
        (!priorityFilter || task.priority === priorityFilter) &&
        (!sizeFilter || task.size === sizeFilter),
    );

  const categories = Array.from(new Set(tasks.map((task) => task.category)));

  const { execute: updateTaskAction } = useAction(updateTask, {
    onExecute: () => {
      setIsLoading(true);
    },
    onSuccess: ({ data }) => {
      setIsLoading(false);

      if (data?.success) {
        router.refresh();
        return;
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },
    onError: ({ error }) => {
      setIsLoading(false);

      if (error.bindArgsValidationErrors) {
        toast.error(error.bindArgsValidationErrors);
        return;
      }
      if (error.serverError) {
        toast.error(error.serverError);
        return;
      }
      if (error.validationErrors?._errors) {
        for (const message of error.validationErrors._errors) {
          toast.error(message);
        }
        return;
      }
    },
  });

  const { execute: deleteTaskAction } = useAction(deleteTask, {
    onExecute: () => {
      setIsLoading(true);
    },
    onSuccess: ({ data }) => {
      setIsLoading(false);

      if (data?.success) {
        router.refresh();
        return;
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },
    onError: ({ error }) => {
      setIsLoading(false);

      if (error.bindArgsValidationErrors) {
        toast.error(error.bindArgsValidationErrors);
        return;
      }
      if (error.serverError) {
        toast.error(error.serverError);
        return;
      }
      if (error.validationErrors?._errors) {
        for (const message of error.validationErrors._errors) {
          toast.error(message);
        }
        return;
      }
    },
  });

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
        <Select
          value={categoryFilter ?? ''}
          onValueChange={(value) =>
            value === 'all'
              ? setCategoryFilter(null)
              : setCategoryFilter(value || null)
          }>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={priorityFilter ?? ''}
          onValueChange={(value: 'all' | 'low' | 'medium' | 'high') =>
            value === 'all'
              ? setPriorityFilter(null)
              : setPriorityFilter(value || null)
          }>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sizeFilter ?? ''}
          onValueChange={(value: 'all' | 'medium' | 'small' | 'large') =>
            value === 'all' ? setSizeFilter(null) : setSizeFilter(value || null)
          }>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sizes</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filteredTasks.length === 0 ? <p>No tasks yet.</p> : null}
      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col p-4 bg-white dark:bg-black rounded shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={task.isCompleted}
                  onCheckedChange={(checked) =>
                    updateTaskAction({
                      ...task,
                      description: task.description ?? undefined,
                      dueDate: task.dueDate ?? undefined,
                      isCompleted: checked as boolean,
                    })
                  }
                />
                <span className={task.isCompleted ? 'line-through' : ''}>
                  {task.title}
                </span>
              </div>
              <Button
                variant="destructive"
                disabled={isLoading}
                onClick={() => deleteTaskAction({ id: task.id })}>
                {isLoading ? <Spinner /> : null}
                Delete
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-600">{task.description}</p>
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>Category: {task.category}</span>
              <span suppressHydrationWarning>
                Due:{' '}
                {task.dueDate ? task.dueDate.toLocaleDateString() : 'Not set'}
              </span>
              <span>Priority: {task.priority}</span>
              <span>Size: {task.size}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
