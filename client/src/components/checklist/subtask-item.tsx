import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface SubTaskItemProps {
  subTask: {
    taskId: string;
    description: string;
    completed: boolean;
    completedAt?: string;
    completedBy?: string;
  };
  onToggle: (completed: boolean) => void;
  getTrainerName: (trainerId: string) => string;
  disabled: boolean;
}

export default function SubTaskItem({ 
  subTask, 
  onToggle, 
  getTrainerName, 
  disabled 
}: SubTaskItemProps) {
  const handleToggle = (checked: boolean) => {
    if (!disabled) {
      onToggle(checked);
    }
  };

  return (
    <div className="flex items-center space-x-3 py-2">
      <Checkbox
        checked={subTask.completed}
        onCheckedChange={handleToggle}
        disabled={disabled}
        className="rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
      />
      <span className={cn(
        "text-sm flex-1",
        subTask.completed ? "text-gray-700 line-through" : "text-gray-700"
      )}>
        {subTask.description}
      </span>
      {subTask.completed && subTask.completedBy && (
        <span className="text-xs text-gray-500 ml-auto">
          Completed by {getTrainerName(subTask.completedBy)}
          {subTask.completedAt && ` ${formatDate(subTask.completedAt)}`}
        </span>
      )}
    </div>
  );
}
