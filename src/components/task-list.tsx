
'use client';

import type { Task, TaskStatus, TaskPriority } from '@/types';
import { TaskItem } from './task-item';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownUp, ListFilter, CalendarDays, Flag, SortAsc, SortDesc, GanttChartSquare } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface TaskListProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSortTasks: (sortBy: 'createdAt' | 'status' | 'title' | 'dueDate' | 'priority', direction: 'asc' | 'desc') => void;
  onGenerateDetailedSteps: (taskId: string) => Promise<void>;
  loadingDetailedStepsTaskId: string | null;
}

type SortOptionValue = `${'createdAt' | 'status' | 'title' | 'dueDate' | 'priority'}-${'asc' | 'desc'}`;

const sortOptions: {label: string; value: SortOptionValue; icon?: React.ElementType}[] = [
  { label: 'Creation Date (Newest)', value: 'createdAt-desc', icon: CalendarDays },
  { label: 'Creation Date (Oldest)', value: 'createdAt-asc', icon: CalendarDays },
  { label: 'Due Date (Soonest)', value: 'dueDate-asc', icon: CalendarDays },
  { label: 'Due Date (Latest)', value: 'dueDate-desc', icon: CalendarDays },
  { label: 'Priority (High to Low)', value: 'priority-asc', icon: Flag }, 
  { label: 'Priority (Low to High)', value: 'priority-desc', icon: Flag }, 
  { label: 'Status (A-Z)', value: 'status-asc', icon: ListFilter },
  { label: 'Status (Z-A)', value: 'status-desc', icon: ListFilter },
  { label: 'Title (A-Z)', value: 'title-asc', icon: SortAsc },
  { label: 'Title (Z-A)', value: 'title-desc', icon: SortDesc },
];


export default function TaskList({ 
  tasks, 
  onUpdateTaskStatus, 
  onToggleSubtask, 
  onDeleteTask, 
  onSortTasks,
  onGenerateDetailedSteps,
  loadingDetailedStepsTaskId 
}: TaskListProps) {
  const [currentSort, setCurrentSort] = useState<SortOptionValue>('createdAt-desc');
  const { t } = useLanguage();

  const handleSortChange = (value: SortOptionValue) => {
    setCurrentSort(value);
    const [sortBy, direction] = value.split('-') as ['createdAt' | 'status' | 'title' | 'dueDate' | 'priority', 'asc' | 'desc'];
    onSortTasks(sortBy, direction);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <GanttChartSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold font-headline mb-2">{t('noTasksYetHeading')}</h3>
        <p className="text-muted-foreground">{t('noTasksYetDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center mb-6">
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[280px]">
            <ArrowDownUp className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort tasks by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              {sortOptions.map(opt => (
                 <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    {opt.icon && <opt.icon className="h-4 w-4 text-muted-foreground" />}
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onToggleSubtask={onToggleSubtask}
            onDeleteTask={onDeleteTask}
            onGenerateDetailedSteps={onGenerateDetailedSteps}
            isLoadingDetailedSteps={loadingDetailedStepsTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
}
