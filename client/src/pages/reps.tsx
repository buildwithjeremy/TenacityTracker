import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import { useState } from 'react';
import TopNav from '@/components/navigation/top-nav';
import BottomNav from '@/components/navigation/bottom-nav';
import RepCard from '@/components/dashboard/rep-card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export default function RepsPage() {
  const [, navigate] = useLocation();
  const { state, dispatch } = useAppState();
  const [stageFilter, setStageFilter] = useState<string>('all');

  // Redirect if not authenticated
  if (!state.isAuthenticated) {
    navigate('/');
    return null;
  }

  if (!state.userRole) {
    navigate('/role-selector');
    return null;
  }

  // Get reps based on user role
  const getRepsForUser = () => {
    if (state.userRole === 'admin') {
      return state.reps; // Admin sees all reps
    } else {
      // Trainer sees only assigned reps
      const currentTrainer = state.trainers.find(t => t.email === state.currentUser?.email);
      if (!currentTrainer) return [];
      const assignedRepIds = Array.isArray(currentTrainer.assignedRepIds) 
        ? currentTrainer.assignedRepIds as string[]
        : [];
      return state.reps.filter(rep => assignedRepIds.includes(rep.id));
    }
  };

  const allReps = getRepsForUser();

  // Filter reps based on stage
  const getFilteredReps = () => {
    switch (stageFilter) {
      case '1-3':
        return allReps.filter(rep => rep.stage >= 1 && rep.stage <= 3);
      case '4-7':
        return allReps.filter(rep => rep.stage >= 4 && rep.stage <= 7);
      case '8-13':
        return allReps.filter(rep => rep.stage >= 8 && rep.stage <= 13);
      default:
        return allReps;
    }
  };

  const filteredReps = getFilteredReps();

  const handleRepClick = (repId: string) => {
    const rep = state.reps.find(r => r.id === repId);
    if (rep) {
      dispatch({ type: 'SELECT_REP', payload: rep });
      navigate(`/rep/${repId}`);
    }
  };

  // Get trainer name for rep
  const getTrainerName = (repId: string) => {
    const rep = state.reps.find(r => r.id === repId);
    if (!rep) return 'Unknown';
    const trainer = state.trainers.find(t => {
      const assignedRepIds = Array.isArray(t.assignedRepIds) 
        ? t.assignedRepIds as string[]
        : [];
      return assignedRepIds.includes(repId);
    });
    return trainer?.name || 'Unassigned';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-semibold text-gray-900">
              {state.userRole === 'admin' ? 'All Representatives' : 'My Representatives'}
            </h1>
            <p className="text-sm text-gray-600">
              {filteredReps.length} of {allReps.length} reps
            </p>
          </div>
          <Filter className="text-gray-400" size={20} />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Stage</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setStageFilter('all')}
              variant={stageFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className={stageFilter === 'all' ? 'bg-primary-500 text-white' : ''}
            >
              All Stages
            </Button>
            <Button
              onClick={() => setStageFilter('1-3')}
              variant={stageFilter === '1-3' ? 'default' : 'outline'}
              size="sm"
              className={stageFilter === '1-3' ? 'bg-primary-500 text-white' : ''}
            >
              Onboarding (1-3)
            </Button>
            <Button
              onClick={() => setStageFilter('4-7')}
              variant={stageFilter === '4-7' ? 'default' : 'outline'}
              size="sm"
              className={stageFilter === '4-7' ? 'bg-primary-500 text-white' : ''}
            >
              Field Training (4-7)
            </Button>
            <Button
              onClick={() => setStageFilter('8-13')}
              variant={stageFilter === '8-13' ? 'default' : 'outline'}
              size="sm"
              className={stageFilter === '8-13' ? 'bg-primary-500 text-white' : ''}
            >
              Independence (8-13)
            </Button>
          </div>
        </div>
      </div>

      {/* Reps List */}
      <div className="px-4 pb-20 space-y-4">
        {filteredReps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-gray-500 mb-4">
              {allReps.length === 0 
                ? 'No representatives found' 
                : 'No representatives match the selected filter'}
            </p>
            {allReps.length === 0 && (
              <Button
                onClick={() => navigate('/add-rep')}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                Add First Representative
              </Button>
            )}
          </div>
        ) : (
          filteredReps.map(rep => (
            <RepCard
              key={rep.id}
              rep={rep}
              trainerName={getTrainerName(rep.id)}
              onClick={() => handleRepClick(rep.id)}
              showTrainer={state.userRole === 'admin'}
            />
          ))
        )}
      </div>

      <BottomNav activeTab="reps" />
    </div>
  );
}