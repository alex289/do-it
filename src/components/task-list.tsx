'use client';

import { deleteTask } from '@/actions/delete-task';
import { updateTask } from '@/actions/update-task';
import { Task } from '@/db/types';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from './spinner';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const router = useRouter();
  const [searchTerm] = useQueryState('search', parseAsString.withDefault(''));
  const [categoryFilter] = useQueryState('category', parseAsString);
  const [priorityFilter] = useQueryState('priority', parseAsString);
  const [sizeFilter] = useQueryState('size', parseAsString);

  const filteredTasks = useMemo(() => {
    return tasks
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
  }, [tasks, searchTerm, categoryFilter, priorityFilter, sizeFilter]);

  const { execute: updateTaskAction } = useAction(updateTask, {
    onExecute: ({ input }) => {
      setLoadingTaskId(input.id);
    },
    onSuccess: ({ data }) => {
      setLoadingTaskId(null);

      if (data?.success) {
        router.refresh();
        return;
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },
    onError: ({ error }) => {
      setLoadingTaskId(null);

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
    onExecute: ({ input }) => {
      setLoadingTaskId(input.id);
    },
    onSuccess: ({ data }) => {
      setLoadingTaskId(null);

      if (data?.success) {
        router.refresh();
        return;
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },
    onError: ({ error }) => {
      setLoadingTaskId(null);

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
    <>
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
                  disabled={loadingTaskId === task.id}
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
                variant="secondary"
                disabled={loadingTaskId === task.id}
                onClick={() => deleteTaskAction({ id: task.id })}>
                {loadingTaskId === task.id ? <Spinner /> : null}
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
    </>
  );
}
