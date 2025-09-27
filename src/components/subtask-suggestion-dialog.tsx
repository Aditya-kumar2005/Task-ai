
'use client';

import type { TaskFormData, TaskPriority } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, CalendarDays, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface SubtaskSuggestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskData: TaskFormData | null;
  aiSuggestions: string[];
  onConfirm: (taskData: TaskFormData, selectedSubtasks: string[]) => void;
}

export function SubtaskSuggestionDialog({
  isOpen,
  onClose,
  taskData,
  aiSuggestions,
  onConfirm,
}: SubtaskSuggestionDialogProps) {
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedSuggestions([]); // Reset selections when dialog opens
    }
  }, [isOpen]);

  if (!taskData) return null;

  const handleToggleSuggestion = (suggestion: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(suggestion) ? prev.filter((s) => s !== suggestion) : [...prev, suggestion]
    );
  };

  const handleConfirm = () => {
    onConfirm(taskData, selectedSuggestions); // Pass the full taskData
    onClose();
  };
  
  const getPriorityBadgeVariant = (priority?: TaskPriority) => {
    if (priority === 'High') return 'destructive';
    if (priority === 'Medium') return 'default';
    return 'secondary';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Subtask Suggestions for: {taskData.title}
          </DialogTitle>
          <DialogDescription>
            Our AI has suggested subtasks to help break down your main task. 
            Review them below and select the ones you'd like to include. 
            You can manage their completion status after the task is created.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Original Task Description:</h3>
            <p className="text-sm p-2 border rounded-md bg-secondary/50 max-h-20 overflow-y-auto">{taskData.description}</p>
          </div>
          {taskData.dueDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Due Date:</span>
              <span>{format(parseISO(taskData.dueDate), 'PPP')}</span>
            </div>
          )}
          {taskData.priority && (
             <div className="flex items-center gap-2 text-sm">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Priority:</span>
              <Badge variant={getPriorityBadgeVariant(taskData.priority)}>{taskData.priority}</Badge>
            </div>
          )}
        </div>

        {aiSuggestions.length > 0 ? (
          <>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 pt-2 border-t">Suggested Subtasks:</h3>
            <ScrollArea className="h-[150px] w-full rounded-md border p-4">
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox
                      id={`suggestion-${index}`}
                      checked={selectedSuggestions.includes(suggestion)}
                      onCheckedChange={() => handleToggleSuggestion(suggestion)}
                    />
                    <Label htmlFor={`suggestion-${index}`} className="font-normal text-sm">
                      {suggestion}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <p className="text-sm text-center text-muted-foreground py-4 border-t">No subtask suggestions available for this task.</p>
        )}
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-primary hover:bg-primary/90">
            Add Task with Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
