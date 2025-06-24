import { Rep } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ChevronRight } from 'lucide-react';
import { calculateProgress, getStageTitle, getStageColor, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RepCardProps {
  rep: Rep;
  trainerName?: string;
  showTrainer?: boolean;
  onClick: () => void;
}

export default function RepCard({ rep, trainerName, showTrainer = false, onClick }: RepCardProps) {
  const progress = calculateProgress(rep.stage);
  const stageTitle = getStageTitle(rep.stage);
  const stageColor = getStageColor(rep.stage);
  const lastUpdated = formatDate(rep.updatedAt);

  const getStageColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50',
          text: 'text-primary-600',
          progress: 'bg-primary-500'
        };
      case 'accent':
        return {
          bg: 'bg-accent-50',
          text: 'text-accent-600',
          progress: 'bg-accent-500'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-50',
          text: 'text-secondary-600',
          progress: 'bg-secondary-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          progress: 'bg-gray-500'
        };
    }
  };

  const colorClasses = getStageColorClasses(stageColor);

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="text-primary-600" size={20} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-gray-900">
                {rep.name}
              </h3>
              <p className="text-sm text-gray-600">{rep.email}</p>
              {showTrainer && trainerName && (
                <p className="text-xs text-gray-500">Trainer: {trainerName}</p>
              )}
            </div>
          </div>
          <Button
            onClick={onClick}
            variant="ghost"
            size="sm"
            className="text-primary-500 hover:text-primary-600 p-2"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              Step {rep.stage} of 13
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn("h-2 rounded-full transition-all duration-300", colorClasses.progress)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            colorClasses.bg,
            colorClasses.text
          )}>
            {stageTitle}
          </span>
          <span className="text-xs text-gray-500">
            Updated {lastUpdated}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
