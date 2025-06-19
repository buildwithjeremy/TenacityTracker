import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import { useState } from 'react';
import TopNav from '@/components/navigation/top-nav';
import BottomNav from '@/components/navigation/bottom-nav';
import RepCard from '@/components/dashboard/rep-card';
import StatsCard from '@/components/dashboard/stats-card';
import FunnelChart from '@/components/dashboard/funnel-chart';
import AddRepModal from '@/components/modals/add-rep-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { state, dispatch } = useAppState();
  const [isAddRepModalOpen, setIsAddRepModalOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('all');

  // Redirect if not authenticated or not an admin
  if (!state.isAuthenticated) {
    navigate('/');
    return null;
  }

  if (state.userRole !== 'admin') {
    navigate('/role-selector');
    return null;
  }

  // Calculate analytics
  const totalReps = state.reps.length;
  const graduatedReps = state.reps.filter(rep => rep.stage >= 13).length;
  const activeTrainers = state.trainers.filter(trainer => 
    trainer.assignedRepIds.length > 0
  ).length;
  const averageProgress = totalReps > 0 
    ? Math.round(state.reps.reduce((sum, rep) => sum + (rep.stage / 13) * 100, 0) / totalReps)
    : 0;

  // Filter reps based on stage
  const getFilteredReps = () => {
    switch (stageFilter) {
      case '1-3':
        return state.reps.filter(rep => rep.stage >= 1 && rep.stage <= 3);
      case '4-7':
        return state.reps.filter(rep => rep.stage >= 4 && rep.stage <= 7);
      case '8-13':
        return state.reps.filter(rep => rep.stage >= 8 && rep.stage <= 13);
      default:
        return state.reps;
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
    const trainer = state.trainers.find(t => t.assignedRepIds.includes(repId));
    return trainer?.name || 'Unassigned';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      {/* Admin Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600">All Teams Overview</p>
          </div>
          <Button
            onClick={() => setIsAddRepModalOpen(true)}
            className="bg-secondary-500 hover:bg-secondary-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors duration-200 p-0"
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatsCard
            value={totalReps}
            label="Total Reps"
            variant="primary"
          />
          <StatsCard
            value={graduatedReps}
            label="Graduated"
            variant="secondary"
          />
          <StatsCard
            value={activeTrainers}
            label="Trainers"
            variant="accent"
          />
          <StatsCard
            value={`${averageProgress}%`}
            label="Avg. Progress"
            variant="neutral"
          />
        </div>

        {/* Funnel Chart */}
        <FunnelChart reps={state.reps} />

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
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
              Onboarding
            </Button>
            <Button
              onClick={() => setStageFilter('4-7')}
              variant={stageFilter === '4-7' ? 'default' : 'outline'}
              size="sm"
              className={stageFilter === '4-7' ? 'bg-primary-500 text-white' : ''}
            >
              Field Training
            </Button>
            <Button
              onClick={() => setStageFilter('8-13')}
              variant={stageFilter === '8-13' ? 'default' : 'outline'}
              size="sm"
              className={stageFilter === '8-13' ? 'bg-primary-500 text-white' : ''}
            >
              Independence
            </Button>
          </div>
        </div>
      </div>

      {/* All Reps List */}
      <div className="px-4 pb-20 space-y-4">
        <h2 className="font-heading font-semibold text-gray-900 text-lg">
          All Representatives
        </h2>
        
        {filteredReps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-gray-500 mb-4">No representatives found</p>
            <Button
              onClick={() => setIsAddRepModalOpen(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Add First Representative
            </Button>
          </div>
        ) : (
          filteredReps.map(rep => (
            <RepCard
              key={rep.id}
              rep={rep}
              trainerName={getTrainerName(rep.id)}
              onClick={() => handleRepClick(rep.id)}
              showTrainer={true}
            />
          ))
        )}
      </div>

      <BottomNav activeTab="dashboard" />
      
      <AddRepModal
        isOpen={isAddRepModalOpen}
        onClose={() => setIsAddRepModalOpen(false)}
        userRole="admin"
      />
    </div>
  );
}
