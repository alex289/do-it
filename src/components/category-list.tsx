'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface CategoryListProps {
  categories: string[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="space-y-2">
        {Object.entries(categories).map(([count, category]) => (
          <Button
            asChild
            key={category}
            variant="outline"
            className="w-full justify-between">
            <Link href={`?category=${category}`}>
              {category}
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                {count}
              </span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
