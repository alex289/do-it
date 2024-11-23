'use client'

import { Button } from "@/components/ui/button"
import { Task } from '@/lib/mockData'

interface CategoryListProps {
  tasks: Task[];
}

export default function CategoryList({ tasks }: CategoryListProps) {
  const categories = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="space-y-2">
        {Object.entries(categories).map(([category, count]) => (
          <Button key={category} variant="outline" className="w-full justify-between">
            {category}
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {count}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}

