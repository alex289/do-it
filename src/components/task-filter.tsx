'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskListProps {
  categories: string[];
}

export default function TaskFilter({ categories }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  );
  const [categoryFilter, setCategoryFilter] = useQueryState(
    'category',
    parseAsString,
  );
  const [priorityFilter, setPriorityFilter] = useQueryState(
    'priority',
    parseAsString,
  );
  const [sizeFilter, setSizeFilter] = useQueryState('size', parseAsString);

  return (
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
        onValueChange={(value) =>
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
        onValueChange={(value) =>
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
  );
}
