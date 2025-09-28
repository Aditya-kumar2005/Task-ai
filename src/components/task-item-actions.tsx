
'use client';

import type { Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Wand2, Loader2 } from 'lucide-react';

interface TaskItemActionsProps {
    task: Task;
    onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
    onGenerateDetailedSteps: (taskId: string) => Promise<void>;
    isLoadingDetailedSteps: boolean;
}

export function TaskItemActions({
    task,
    onUpdateTaskStatus,
    onDeleteTask,
    onGenerateDetailedSteps,
    isLoadingDetailedSteps
}: TaskItemActionsProps) {
    const taskStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Completed'];

    return (
        <>
            <div className="flex items-center gap-2">
                 <Select
                    value={task.status}
                    onValueChange={(newStatus: TaskStatus) => onUpdateTaskStatus(task.id, newStatus)}
                    >
                    <SelectTrigger id={`status-${task.id}`} className="w-[150px] text-xs h-9">
                        <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                        {taskStatuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-xs">
                            {status}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onGenerateDetailedSteps(task.id)} 
                    disabled={isLoadingDetailedSteps}
                    aria-label="Generate detailed steps with AI"
                    className="text-primary border-primary/50 hover:bg-primary/10 hover:text-primary h-9"
                >
                    {isLoadingDetailedSteps ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    AI Steps
                </Button>
            </div>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDeleteTask(task.id)} 
                aria-label={`Delete task titled ${task.title}`}
                className="text-destructive hover:bg-destructive/10 h-9 w-9"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </>
    );
}
