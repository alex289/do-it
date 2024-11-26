'use client';

import { Task } from '@/db/types';
import { parseAsString, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';

interface CategoryListProps {
  categories: string[];
  tasks: Task[];
}

export default function CategoryList({ categories, tasks }: CategoryListProps) {
  const [categoryFilter, setCategoryFilter] = useQueryState(
    'category',
    parseAsString,
  );
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-5">Categories</h2>
      <div className="space-y-2">
        {Object.entries(categories).map(([_, category]) => (
          <Button
            key={category}
            disabled={categoryFilter === category}
            onClick={() => setCategoryFilter(category)}
            variant="outline"
            className="w-full justify-between">
            {category}
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {tasks.filter((task) => task.category === category).length}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
