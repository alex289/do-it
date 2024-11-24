'use client';

import { createTask } from '@/actions/create-task';
import { CalendarIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from './spinnter';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TaskDialogProps {
  categories: string[];
}

export default function TaskDialog({ categories }: TaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isNewCategory ? newCategory : category;
    createTaskAction({
      title,
      description,
      category: finalCategory,
      isCompleted: false,
      dueDate,
      priority,
      size,
    });
  };

  const { execute: createTaskAction } = useAction(createTask, {
    onExecute: () => {
      setIsLoading(true);
    },
    onSuccess: ({ data }) => {
      setIsLoading(false);

      if (data?.id) {
        router.refresh();
        setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task with all the details. Click save when you are
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Select
              value={category}
              onValueChange={(value) => {
                if (value === 'new') {
                  setIsNewCategory(true);
                  setCategory('');
                } else {
                  setIsNewCategory(false);
                  setCategory(value);
                }
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="new">Add new category</SelectItem>
              </SelectContent>
            </Select>
            {isNewCategory && (
              <Input
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'}>
                  {dueDate ? (
                    dueDate.toLocaleDateString()
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
            <Select
              value={priority}
              onValueChange={(value: 'low' | 'medium' | 'high') =>
                setPriority(value)
              }>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={size}
              onValueChange={(value: 'small' | 'medium' | 'large') =>
                setSize(value)
              }>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : null}
              Save Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
