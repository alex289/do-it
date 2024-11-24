'use client';

import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

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
import { Task } from '@/lib/mockData';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TaskDialogProps {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  categories: string[];
}

export default function TaskDialog({ addTask, categories }: TaskDialogProps) {
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
    addTask({
      title,
      description,
      category: finalCategory,
      isCompleted: false,
      dueDate,
      priority,
      size,
    });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setNewCategory('');
    setIsNewCategory(false);
    setDueDate(undefined);
    setPriority('medium');
    setSize('medium');
  };

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
            <Button type="submit">Save Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
