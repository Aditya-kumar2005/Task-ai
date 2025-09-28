
'use client';

import type { Task, TaskStatus, TaskPriority } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ListChecks, CalendarDays, Flag, AlertTriangle, Info } from 'lucide-react';
import { format, parseISO, isPast, isToday, formatDistanceToNowStrict } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { VariantProps } from "class-variance-authority";
import { TaskItemActions } from './task-item-actions';

interface TaskItemProps {
  task: Task;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onGenerateDetailedSteps: (taskId: string) => Promise<void>;
  isLoadingDetailedSteps: boolean;
}

export function TaskItem({ 
  task, 
  onUpdateTaskStatus, 
  onToggleSubtask, 
  onDeleteTask,
  onGenerateDetailedSteps,
  isLoadingDetailedSteps 
}: TaskItemProps) {

  const getStatusBadgeVariant = (status: TaskStatus): VariantProps<typeof badgeVariants>['variant'] => {
    switch (status) {
      case 'To Do': return 'secondary';
      case 'In Progress': return 'default';
      case 'Completed': return 'outline'; 
      default: return 'secondary';
    }
  };
  
  const getPriorityBadgeVariant = (priority?: TaskPriority): VariantProps<typeof badgeVariants>['variant'] => {
    if (priority === 'High') return 'destructive';
    if (priority === 'Medium') return 'default';
    return 'secondary'; 
  };

  const DueDateDisplay = ({ dueDateISO }: { dueDateISO: string }) => {
    const dueDateObj = parseISO(dueDateISO);
    let text = format(dueDateObj, 'MMM d, yyyy');
    let colorClass = 'text-muted-foreground';
    let Icon = CalendarDays;

    if (isToday(dueDateObj) && task.status !== 'Completed') {
      text = `Due today`;
      colorClass = 'text-orange-600 dark:text-orange-400 font-medium';
    } else if (isPast(dueDateObj) && task.status !== 'Completed') {
      text = `Overdue by ${formatDistanceToNowStrict(dueDateObj)}`;
      colorClass = 'text-destructive font-medium';
      Icon = AlertTriangle;
    } else if (task.status !== 'Completed') {
       text = `Due ${formatDistanceToNowStrict(dueDateObj, { addSuffix: true })}`;
    } else {
      text = `Was due ${format(dueDateObj, 'MMM d, yyyy')}`;
    }

    return (
      <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
        <Icon className="h-3.5 w-3.5" />
        <span>{text}</span>
      </div>
    );
  };

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <TooltipProvider>
      <Card className="w-full shadow-lg rounded-lg overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between gap-2 p-4 bg-card">
          <div>
            <CardTitle className="text-lg font-semibold font-headline">{task.title}</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 mt-1">
              <CardDescription className="text-xs text-muted-foreground">
                Created: {format(parseISO(task.createdAt), 'MMM d, yyyy HH:mm')}
              </CardDescription>
              {task.dueDate && <DueDateDisplay dueDateISO={task.dueDate} />}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusBadgeVariant(task.status)} className="self-end">{task.status}</Badge>
            {task.priority && (
              <Badge variant={getPriorityBadgeVariant(task.priority)} className="self-end flex items-center gap-1">
                <Flag className="h-3 w-3" />
                {task.priority}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <p className="text-sm mb-4">{task.description}</p>
          
          {task.subtasks && task.subtasks.length > 0 && (
            <Accordion type="single" collapsible className="w-full" defaultValue="subtasks">
              <AccordionItem value="subtasks">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4" />
                      Subtasks ({completedSubtasks}/{totalSubtasks} completed)
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                         <Info className="h-4 w-4 text-muted-foreground hover:text-foreground ml-2" />
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center">
                        <p className="text-xs max-w-xs">
                          Subtasks are smaller steps for your main task. Check the box to mark one as complete.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 mt-2 pl-2 border-l-2 border-border ml-2">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          id={`subtask-${subtask.id}`}
                          checked={subtask.completed}
                          onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                          aria-label={`Mark subtask ${subtask.text} as ${subtask.completed ? 'incomplete' : 'complete'}`}
                        />
                        <label
                          htmlFor={`subtask-${subtask.id}`}
                          className={`flex-grow ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {subtask.text}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t bg-card flex justify-between items-center">
            <TaskItemActions
                task={task}
                onUpdateTaskStatus={onUpdateTaskStatus}
                onGenerateDetailedSteps={onGenerateDetailedSteps}
                isLoadingDetailedSteps={isLoadingDetailedSteps}
                onDeleteTask={onDeleteTask}
            />
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
