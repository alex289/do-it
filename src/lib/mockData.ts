export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
  createdAt: Date;
  dueDate: Date | undefined;
  priority: 'low' | 'medium' | 'high';
  size: 'small' | 'medium' | 'large';
}

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Draft and finalize the project proposal for the new client",
    category: "Work",
    isCompleted: false,
    createdAt: new Date("2023-05-01"),
    dueDate: new Date("2023-05-10"),
    priority: "high",
    size: "large",
  },
  {
    id: 2,
    title: "Go grocery shopping",
    description: "Buy milk, eggs, bread, and cheese",
    category: "Personal",
    isCompleted: true,
    createdAt: new Date("2023-05-02"),
    dueDate: undefined,
    priority: "low",
    size: "small",
  },
  {
    id: 3,
    title: "Prepare for team meeting",
    description: "Review the agenda and prepare presentation materials",
    category: "Work",
    isCompleted: false,
    createdAt: new Date("2023-05-03"),
    dueDate: new Date("2023-05-09"),
    priority: "medium",
    size: "medium",
  },
  {
    id: 4,
    title: "Exercise",
    description: "Go for a run or workout at the gym",
    category: "Personal",
    isCompleted: false,
    createdAt: new Date("2023-05-04"),
    dueDate: new Date("2023-05-04"),
    priority: "low",
    size: "small",
  },
  {
    id: 5,
    title: "Pay bills",
    description: "Pay electricity, internet, and credit card bills",
    category: "Errands",
    isCompleted: false,
    createdAt: new Date("2023-05-05"),
    dueDate: new Date("2023-05-07"),
    priority: "medium",
    size: "small",
  },
];

