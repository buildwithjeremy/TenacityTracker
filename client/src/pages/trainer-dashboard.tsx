import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import TopNav from '@/components/navigation/top-nav';
import BottomNav from '@/components/navigation/bottom-nav';
import RepCard from '@/components/dashboard/rep-card';
import StatsCard from '@/components/dashboard/stats-card';
import AddRepModal from '@/components/modals/add-rep-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function TrainerDashboard() {
  const [, navigate] = useLocation();
  const { state, dispatch } = useAppState();
  const [isAddRepModalOpen, setIsAddRepModalOpen] = useState(false);

  // Redirect if not authenticated or not a trainer
  if (!state.isAuthenticated) {
    navigate('/');
    return null;
  }

  if (state.userRole !== 'trainer') {
    navigate('/role-selector');
    return null;
  }

  // Get trainer's assigned reps
  const currentTrainer = state.trainers.find(t => t.email === state.currentUser?.email);
  const assignedReps = state.reps.filter(rep => 
    currentTrainer?.assignedRepIds.includes(rep.id)
  );

  const stats = {
    activeReps: assignedReps.filter(rep => rep.stage < 13).length,
    completedReps: assignedReps.filter(rep => rep.stage >= 13).length,
  };

  const handleRepClick = (repId: string) => {
    const rep = assignedReps.find(r => r.id === repId);
    if (rep) {
      dispatch({ type: 'SELECT_REP', payload: rep });
      navigate(`/rep/${repId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      {/* Mobile Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-semibold text-gray-900">
              My Trainees
            </h1>
            <p className="text-sm text-gray-600">
              {assignedReps.length} Active Trainees
            </p>
          </div>
          <Button
            onClick={() => setIsAddRepModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors duration-200 p-0"
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            value={stats.activeReps}
            label="Active"
            variant="primary"
          />
          <StatsCard
            value={stats.completedReps}
            label="Graduated"
            variant="secondary"
          />
        </div>
      </div>

      {/* Rep Cards List */}
      <div className="px-4 pb-20 space-y-4">
        {assignedReps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-gray-500 mb-4">No assigned trainees yet</p>
            <Button
              onClick={() => setIsAddRepModalOpen(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Add Your First Trainee
            </Button>
          </div>
        ) : (
          assignedReps.map(rep => (
            <RepCard
              key={rep.id}
              rep={rep}
              onClick={() => handleRepClick(rep.id)}
            />
          ))
        )}
      </div>

      <BottomNav activeTab="dashboard" />
      
      <AddRepModal
        isOpen={isAddRepModalOpen}
        onClose={() => setIsAddRepModalOpen(false)}
        userRole="trainer"
      />
    </div>
  );
}
