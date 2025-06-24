import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SubTaskItem from './subtask-item';
import { AppUser, FieldTrainer } from '@shared/schema';

interface StepItemProps {
  step: {
    stepId: number;
    title: string;
    description: string;
    completed: boolean;
    completedAt?: string;
    completedBy?: string;
    subTasks: Array<{
      taskId: string;
      description: string;
      completed: boolean;
      completedAt?: string;
      completedBy?: string;
    }>;
  };
  isExpanded: boolean;
  isCurrentStep: boolean;
  isLocked: boolean;
  onToggleExpanded: () => void;
  onSubTaskToggle: (taskId: string, completed: boolean) => void;
  currentUser: AppUser | null;
  trainers: FieldTrainer[];
}

export default function StepItem({
  step,
  isExpanded,
  isCurrentStep,
  isLocked,
  onToggleExpanded,
  onSubTaskToggle,
  currentUser,
  trainers
}: StepItemProps) {
  const getStepIcon = () => {
    if (step.completed) {
      return <Check className="text-secondary-600" size={16} />;
    } else if (isCurrentStep) {
      return <span className="text-accent-600 font-bold text-sm">{step.stepId}</span>;
    } else {
      return <span className="text-gray-500 font-bold text-sm">{step.stepId}</span>;
    }
  };

  const getStepStatus = () => {
    if (step.completed) return { text: 'COMPLETED', class: 'text-secondary-600' };
    if (isCurrentStep) return { text: 'IN PROGRESS', class: 'text-accent-600' };
    if (isLocked) return { text: 'LOCKED', class: 'text-gray-400' };
    return { text: 'PENDING', class: 'text-gray-400' };
  };

  const getCardClasses = () => {
    if (step.completed) {
      return 'bg-white rounded-xl shadow-sm border border-gray-100';
    } else if (isCurrentStep) {
      return 'bg-white rounded-xl shadow-sm border-2 border-accent-200';
    } else if (isLocked) {
      return 'bg-white rounded-xl shadow-sm border border-gray-100 opacity-60';
    }
    return 'bg-white rounded-xl shadow-sm border border-gray-100';
  };

  const getIconBackgroundClasses = () => {
    if (step.completed) {
      return 'w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center';
    } else if (isCurrentStep) {
      return 'w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center';
    }
    return 'w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center';
  };

  const status = getStepStatus();

  // Get trainer name by ID
  const getTrainerName = (trainerId: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer?.name || 'Unknown Trainer';
  };

  return (
    <Card className={getCardClasses()}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={getIconBackgroundClasses()}>
              {getStepIcon()}
            </div>
            <div>
              <h3 className={cn(
                "font-heading font-semibold",
                isLocked ? "text-gray-500" : "text-gray-900"
              )}>
                {step.title}
              </h3>
              <p className={cn("text-xs font-medium", status.class)}>
                {status.text}
              </p>
            </div>
          </div>
          {!isLocked && (
            <Button
              onClick={onToggleExpanded}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
          )}
        </div>

        {isExpanded && !isLocked && (
          <div className="space-y-2 pl-11">
            {step.subTasks.map((subTask) => (
              <SubTaskItem
                key={subTask.taskId}
                subTask={subTask}
                onToggle={(completed) => onSubTaskToggle(subTask.taskId, completed)}
                getTrainerName={getTrainerName}
                disabled={isLocked}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
