import { useParams, useLocation } from 'wouter';
import { useAppState } from '@/hooks/use-app-state';
import { useState, useEffect } from 'react';
import TopNav from '@/components/navigation/top-nav';
import StepItem from '@/components/checklist/step-item';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { calculateProgress, getStageTitle } from '@/lib/utils';
import checklistSteps from '@/data/checklist-steps.json';

export default function RepChecklistPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { state, dispatch } = useAppState();
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([4])); // Default expand current step

  // Redirect if not authenticated
  if (!state.isAuthenticated) {
    navigate('/');
    return null;
  }

  const rep = state.reps.find(r => r.id === id);
  if (!rep) {
    navigate(state.userRole === 'admin' ? '/admin-dashboard' : '/trainer-dashboard');
    return null;
  }

  // Set selected rep if not already set
  useEffect(() => {
    if (state.selectedRep?.id !== rep.id) {
      dispatch({ type: 'SELECT_REP', payload: rep });
    }
  }, [rep.id, state.selectedRep?.id, dispatch]);

  const progress = calculateProgress(rep.stage);
  const stageTitle = getStageTitle(rep.stage);

  const handleGoBack = () => {
    const dashboardPath = state.userRole === 'admin' ? '/admin-dashboard' : '/trainer-dashboard';
    navigate(dashboardPath);
  };

  const toggleStepExpanded = (stepId: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const handleSubTaskToggle = (stepId: number, taskId: string, completed: boolean) => {
    dispatch({
      type: 'UPDATE_SUBTASK',
      payload: {
        repId: rep.id,
        stepId,
        taskId,
        completed
      }
    });

    // Add audit log
    dispatch({
      type: 'ADD_AUDIT_LOG',
      payload: {
        repId: rep.id,
        trainerId: state.currentUser?.id || '',
        action: completed ? 'task_completed' : 'task_uncompleted',
        description: `${completed ? 'Completed' : 'Uncompleted'} task in Step ${stepId} for ${rep.name}`
      }
    });
  };

  // Get milestone data for each step, merging with default steps
  const getMilestoneForStep = (stepId: number) => {
    const milestones = Array.isArray(rep.milestones) ? rep.milestones : [];
    return milestones.find((m: any) => m.stepId === stepId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      {/* Checklist Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800 p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="text-primary-600" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold text-gray-900">
                {rep.name}
              </h1>
              <p className="text-sm text-gray-600">{rep.email}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">
              Step {rep.stage} of 13 ({progress}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-secondary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 13-Step Checklist */}
      <div className="p-4 space-y-4 pb-20">
        {checklistSteps.map((step) => {
          const milestone = getMilestoneForStep(step.stepId);
          const isExpanded = expandedSteps.has(step.stepId);
          const isCurrentStep = step.stepId === rep.stage;
          const isCompleted = milestone?.completed || step.stepId < rep.stage;
          const isLocked = step.stepId > rep.stage;

          return (
            <StepItem
              key={step.stepId}
              step={{
                ...step,
                completed: isCompleted,
                completedAt: milestone?.completedAt,
                completedBy: milestone?.completedBy,
                subTasks: step.subTasks.map(task => {
                  const milestoneTask = milestone?.subTasks.find((t: any) => t.taskId === task.taskId);
                  return {
                    ...task,
                    completed: milestoneTask?.completed || false,
                    completedAt: milestoneTask?.completedAt,
                    completedBy: milestoneTask?.completedBy,
                  };
                })
              }}
              isExpanded={isExpanded}
              isCurrentStep={isCurrentStep}
              isLocked={isLocked}
              onToggleExpanded={() => toggleStepExpanded(step.stepId)}
              onSubTaskToggle={(taskId, completed) => handleSubTaskToggle(step.stepId, taskId, completed)}
              currentUser={state.currentUser}
              trainers={state.trainers}
            />
          );
        })}
        
        {/* Show remaining steps message */}
        {rep.stage < 13 && (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">
              {13 - rep.stage} more steps to complete Field Trainer certification
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
