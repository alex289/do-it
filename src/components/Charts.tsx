'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Task } from '@/lib/mockData'

interface ChartsProps {
  tasks: Task[];
}

export default function Charts({ tasks }: ChartsProps) {
  const chartData = Object.entries(
    tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { completed: 0, total: 0 }
      }
      acc[task.category].total++
      if (task.isCompleted) {
        acc[task.category].completed++
      }
      return acc
    }, {} as Record<string, { completed: number; total: number }>)
  ).map(([category, data]) => ({
    category,
    completed: data.completed,
    total: data.total
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completed: {
              label: "Completed",
              color: "hsl(var(--chart-1))",
            },
            total: {
              label: "Total",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px] max-w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" />
              <Bar dataKey="total" stackId="a" fill="var(--color-total)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

