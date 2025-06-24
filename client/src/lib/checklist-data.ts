import checklistSteps from '@/data/checklist-steps.json';

export const getChecklistSteps = () => checklistSteps;

export const getStepById = (stepId: number) => {
  return checklistSteps.find(step => step.stepId === stepId);
};

export const createMilestoneFromStep = (stepId: number) => {
  const step = getStepById(stepId);
  if (!step) return null;
  
  return {
    stepId: stepId,
    title: step.title,
    completed: false,
    subTasks: step.subTasks.map(task => ({
      taskId: task.taskId,
      description: task.description,
      completed: false,
    }))
  };
};