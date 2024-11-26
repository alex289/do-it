'use client';

import { createTask } from '@/actions/create-task';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
import { Spinner } from './spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TaskDialogProps {
  categories: string[];
}

const taskFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  isCompleted: z.boolean(),
  dueDate: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  size: z.enum(['small', 'medium', 'large']),
});

export default function TaskDialog({ categories }: TaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      isCompleted: false,
      dueDate: undefined,
      priority: 'medium',
      size: 'medium',
    },
  });

  const { execute: createTaskAction } = useAction(createTask, {
    onExecute: () => {
      setIsLoading(true);
    },
    onSuccess: ({ data }) => {
      setIsLoading(false);

      if (data?.id) {
        router.refresh();
        setIsOpen(false);
        form.reset();
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createTaskAction)}
            className="grid gap-4">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Clean house" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Task description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <div>
                        <Select
                          {...field}
                          disabled={field.disabled}
                          onValueChange={(value) => {
                            if (value === 'new') {
                              setIsNewCategory(true);
                              field.onChange('');
                            }

                            if (categories.includes(value)) {
                              setIsNewCategory(false);
                              field.onChange(value);
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
                            <SelectItem value="new">
                              Add new category
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {isNewCategory && (
                          <Input
                            className="mt-3"
                            placeholder="Enter new category"
                            disabled={field.disabled}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button disabled={field.disabled} variant={'outline'}>
                            {field.value ? (
                              field.value.toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: 'low' | 'medium' | 'high') =>
                          field.onChange(value)
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: 'small' | 'medium' | 'large') =>
                          field.onChange(value)
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner className="text-white dark:text-black" />
                ) : null}
                Save Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
