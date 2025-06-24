import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppUser, Rep, FieldTrainer, AuditLog } from '@shared/schema';
import { generateId, formatDate } from '@/lib/utils';

// Import dummy data
import dummyReps from '@/data/dummy-reps.json';
import dummyTrainers from '@/data/dummy-trainers.json';

type AppState = {
  isAuthenticated: boolean;
  currentUser: AppUser | null;
  userRole: 'trainer' | 'admin' | null;
  reps: Rep[];
  trainers: FieldTrainer[];
  auditLogs: AuditLog[];
  selectedRep: Rep | null;
};

type AppAction =
  | { type: 'SIGN_IN'; payload: AppUser }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_ROLE'; payload: 'trainer' | 'admin' }
  | { type: 'ADD_REP'; payload: Omit<Rep, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_REP'; payload: { id: string; updates: Partial<Rep> } }
  | { type: 'SELECT_REP'; payload: Rep | null }
  | { type: 'UPDATE_SUBTASK'; payload: { repId: string; stepId: number; taskId: string; completed: boolean } }
  | { type: 'ADD_AUDIT_LOG'; payload: Omit<AuditLog, 'id' | 'timestamp'> };

const initialState: AppState = {
  isAuthenticated: false,
  currentUser: null,
  userRole: null,
  reps: dummyReps.map(rep => ({
    ...rep,
    createdAt: new Date(rep.createdAt),
    updatedAt: new Date(rep.updatedAt)
  })) as Rep[],
  trainers: dummyTrainers.map(trainer => ({
    ...trainer,
    createdAt: new Date(trainer.createdAt)
  })) as FieldTrainer[],
  auditLogs: [],
  selectedRep: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload,
      };

    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null,
        userRole: null,
      };

    case 'SET_ROLE':
      return {
        ...state,
        userRole: action.payload,
        currentUser: state.currentUser ? {
          ...state.currentUser,
          role: action.payload
        } : null,
      };

    case 'ADD_REP':
      const newRep: Rep = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...state,
        reps: [...state.reps, newRep],
      };

    case 'UPDATE_REP':
      return {
        ...state,
        reps: state.reps.map(rep =>
          rep.id === action.payload.id
            ? { ...rep, ...action.payload.updates, updatedAt: new Date() }
            : rep
        ),
        selectedRep: state.selectedRep?.id === action.payload.id
          ? { ...state.selectedRep, ...action.payload.updates, updatedAt: new Date() }
          : state.selectedRep,
      };

    case 'SELECT_REP':
      return {
        ...state,
        selectedRep: action.payload,
      };

    case 'UPDATE_SUBTASK':
      const { repId, stepId, taskId, completed } = action.payload;
      const updatedReps = state.reps.map(rep => {
        if (rep.id !== repId) return rep;

        const milestones = Array.isArray(rep.milestones) ? rep.milestones : [];
        let existingMilestone = milestones.find((m: any) => m.stepId === stepId);
        
        // If milestone doesn't exist for this step, we need to create it
        if (!existingMilestone) {
          // Create a basic milestone structure - the actual step data will come from the checklist JSON
          existingMilestone = {
            stepId: stepId,
            title: `Step ${stepId}`,
            completed: false,
            subTasks: []
          };
          milestones.push(existingMilestone);
        }

        const updatedMilestones = milestones.map((milestone: any) => {
          if (milestone.stepId !== stepId) return milestone;

          // Ensure subTasks array exists
          if (!milestone.subTasks) {
            milestone.subTasks = [];
          }

          // Check if the subtask exists, if not create it
          let taskExists = milestone.subTasks.find((task: any) => task.taskId === taskId);
          if (!taskExists) {
            milestone.subTasks.push({
              taskId: taskId,
              description: `Task ${taskId}`,
              completed: false,
            });
          }

          const updatedSubTasks = milestone.subTasks.map((task: any) => {
            if (task.taskId !== taskId) return task;
            return {
              ...task,
              completed,
              completedAt: completed ? new Date().toISOString() : undefined,
              completedBy: completed ? state.currentUser?.id : undefined,
            };
          });

          // Check if all subtasks are completed to auto-complete step
          const allSubTasksComplete = updatedSubTasks.every((task: any) => task.completed);
          
          return {
            ...milestone,
            completed: allSubTasksComplete,
            completedAt: allSubTasksComplete && !milestone.completed ? new Date().toISOString() : milestone.completedAt,
            completedBy: allSubTasksComplete && !milestone.completed ? state.currentUser?.id : milestone.completedBy,
            subTasks: updatedSubTasks,
          };
        });

        // Update stage if step is completed
        const completedSteps = updatedMilestones.filter((m: any) => m.completed).length;
        const newStage = Math.max(rep.stage, completedSteps + 1);

        return {
          ...rep,
          milestones: updatedMilestones,
          stage: newStage,
          updatedAt: new Date(),
        };
      });

      return {
        ...state,
        reps: updatedReps,
        selectedRep: state.selectedRep?.id === repId 
          ? updatedReps.find(r => r.id === repId) || null 
          : state.selectedRep,
      };

    case 'ADD_AUDIT_LOG':
      const newLog: AuditLog = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date(),
      };
      return {
        ...state,
        auditLogs: [newLog, ...state.auditLogs],
      };

    default:
      return state;
  }
}

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return React.createElement(
    AppStateContext.Provider,
    { value: { state, dispatch } },
    children
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
