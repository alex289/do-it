'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';

interface CategoryListProps {
  categories: string[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [_, setCategoryFilter] = useQueryState('category', parseAsString);
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="space-y-2">
        {Object.entries(categories).map(([count, category]) => (
          <Button
            key={category}
            onClick={() => setCategoryFilter(category)}
            variant="outline"
            className="w-full justify-between">
            {category}
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {count}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
