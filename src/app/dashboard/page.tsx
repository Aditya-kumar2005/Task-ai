
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Task, Subtask, TaskStatus, TaskFormData, TaskPriority } from '@/types';
import { SiteHeader } from '@/components/site-header';
import { TaskForm } from '@/components/task-form';
import { TaskList } from '@/components/task-list';
import { SubtaskSuggestionDialog } from '@/components/subtask-suggestion-dialog';
import { getAISubtaskSuggestions, getAIDetailedSteps } from '../actions'; // Adjusted path
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import { useRouter } from 'next/navigation'; // Import useRouter

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAISuggestions, setIsLoadingAISuggestions] = useState(false);
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [currentTaskDataForAI, setCurrentTaskDataForAI] = useState<TaskFormData | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingDetailedStepsTaskId, setLoadingDetailedStepsTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth(); // Get auth state
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated and auth is not loading
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    // Only load tasks if authenticated
    if (isAuthenticated) {
      try {
        const storedTasks = localStorage.getItem('taskai-tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Failed to load tasks from localStorage", error);
        toast({ title: "Error", description: "Could not load saved tasks.", variant: "destructive" });
      }
    }
    setIsLoading(false); // Combined with auth check or separate
  }, [toast, isAuthenticated]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) { // Only save if authenticated
      try {
        localStorage.setItem('taskai-tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
        toast({ title: "Error", description: "Could not save tasks. Changes might not persist.", variant: "destructive" });
      }
    }
  }, [tasks, isLoading, toast, isAuthenticated]);

  const handleTaskFormSubmit = async (data: TaskFormData) => {
    setCurrentTaskDataForAI(data);
    setIsLoadingAISuggestions(true);
    setShowSuggestionDialog(true);
    
    const result = await getAISubtaskSuggestions({ taskDescription: data.description });
    
    if ('error' in result) {
      toast({ title: 'AI Suggestion Error', description: result.error, variant: 'destructive' });
      setAiSuggestions([]);
    } else {
      setAiSuggestions(result.subtasks || []);
    }
    setIsLoadingAISuggestions(false);
  };

  const handleConfirmTaskWithSubtasks = (taskData: TaskFormData, selectedSubtaskTexts: string[]) => {
    const newSubtasks: Subtask[] = selectedSubtaskTexts.map(text => ({
      id: crypto.randomUUID(),
      text,
      completed: false,
    }));

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description,
      status: 'To Do',
      createdAt: new Date().toISOString(),
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      subtasks: newSubtasks,
    };

    setTasks(prevTasks => [newTask, ...prevTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    toast({ title: 'Task Created', description: `"${newTask.title}" has been added.` });
    setShowSuggestionDialog(false);
    setCurrentTaskDataForAI(null);
    setAiSuggestions([]);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      )
    );
    toast({ title: 'Task Updated', description: `Task status changed to "${status}".` });
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask =>
                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
              ),
            }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (taskToDelete) {
      toast({ title: 'Task Deleted', description: `"${taskToDelete.title}" has been removed.`, variant: 'destructive' });
    }
  };

  const handleSortTasks = useCallback((sortBy: 'createdAt' | 'status' | 'title' | 'dueDate' | 'priority', direction: 'asc' | 'desc') => {
    setTasks(prevTasks => {
      const sortedTasks = [...prevTasks].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'priority') {
          const priorityOrder: Record<TaskPriority, number> = { 'High': 1, 'Medium': 2, 'Low': 3 };
          const valA = a.priority ? priorityOrder[a.priority] : 4; 
          const valB = b.priority ? priorityOrder[b.priority] : 4;
          comparison = valA - valB; 
          if (direction === 'desc') { 
             // For Low to High, reverse the comparison logic for priority
            comparison = (priorityOrder[b.priority!] || 4) - (priorityOrder[a.priority!] || 4);
          }
        } else if (sortBy === 'createdAt') {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); 
          if (direction === 'desc') { 
            comparison *= -1;
          }
        } else if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
          if (direction === 'desc') {
            comparison *= -1;
          }
        } else if (sortBy === 'status') {
          const statusOrder: Record<TaskStatus, number> = { 'To Do': 1, 'In Progress': 2, 'Completed': 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          if (direction === 'desc') {
            comparison *= -1;
          }
        } else if (sortBy === 'dueDate') {
          const valA = a.dueDate ? new Date(a.dueDate).getTime() : (direction === 'asc' ? Infinity : -Infinity);
          const valB = b.dueDate ? new Date(b.dueDate).getTime() : (direction === 'asc' ? Infinity : -Infinity);
          comparison = valA - valB;
          // No need to multiply by -1 for desc if using Infinity correctly
        }

        // Secondary sort: by creation date (oldest first) if primary sort keys are equal
        if (comparison === 0) {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        
        return comparison;
      });
      return sortedTasks;
    });
  }, []);

  const handleGenerateDetailedSteps = async (taskId: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) {
      toast({ title: "Error", description: "Task not found.", variant: "destructive" });
      return;
    }

    setLoadingDetailedStepsTaskId(taskId);
    const result = await getAIDetailedSteps({ taskTitle: taskToUpdate.title, taskDescription: taskToUpdate.description });
    
    if ('error' in result) {
      toast({ title: 'AI Detailed Steps Error', description: result.error, variant: 'destructive' });
    } else {
      const newDetailedSubtasks: Subtask[] = (result.detailedSteps || []).map(text => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
      }));
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, subtasks: newDetailedSubtasks } : task
        )
      );
      toast({ title: 'AI Steps Generated', description: `New detailed steps added for "${taskToUpdate.title}".` });
    }
    setLoadingDetailedStepsTaskId(null);
  };


  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Progress value={50} className="w-1/2 md:w-1/4" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // This will typically not be seen due to the redirect, but good for robustness
    return (
       <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <TaskForm onSubmit={handleTaskFormSubmit} isLoadingAISuggestions={isLoadingAISuggestions && showSuggestionDialog} />
        <TaskList
          tasks={tasks}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onToggleSubtask={handleToggleSubtask}
          onDeleteTask={handleDeleteTask}
          onSortTasks={handleSortTasks}
          onGenerateDetailedSteps={handleGenerateDetailedSteps}
          loadingDetailedStepsTaskId={loadingDetailedStepsTaskId}
        />
      </main>
      <SubtaskSuggestionDialog
        isOpen={showSuggestionDialog}
        onClose={() => {
          setShowSuggestionDialog(false);
          setCurrentTaskDataForAI(null);
          setAiSuggestions([]);
          setIsLoadingAISuggestions(false);
        }}
        taskData={currentTaskDataForAI}
        aiSuggestions={aiSuggestions}
        onConfirm={handleConfirmTaskWithSubtasks}
      />
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        {t('footerText')}
      </footer>
    </div>
  );
}
