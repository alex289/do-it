'use client';

import { Task } from '@/db/types';
import {
  Cell,
  Pie,
  PieChart as RechartsChart,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface PieChartProps {
  tasks: Task[];
}

export default function TaskStatusChart({ tasks }: PieChartProps) {
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const openTasks = tasks.length - completedTasks;

  const data = [
    { name: 'Completed', value: completedTasks },
    { name: 'Open', value: openTasks },
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completed: {
              label: 'Completed',
              color: COLORS[0],
            },
            open: {
              label: 'Open',
              color: COLORS[1],
            },
          }}
          className="h-[300px] max-w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </RechartsChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
