import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import { useState } from 'react';
import TopNav from '@/components/navigation/top-nav';
import BottomNav from '@/components/navigation/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Clock, Filter, User, UserPlus, Award, CheckCircle } from 'lucide-react';
import type { AuditLog } from '@shared/schema';

export default function ActivityPage() {
  const [, navigate] = useLocation();
  const { state } = useAppState();
  const [activityFilter, setActivityFilter] = useState<string>('all');

  // Redirect if not authenticated
  if (!state.isAuthenticated) {
    navigate('/');
    return null;
  }

  if (!state.userRole) {
    navigate('/role-selector');
    return null;
  }

  // Get activity logs based on user role
  const getActivityForUser = () => {
    if (state.userRole === 'admin') {
      return state.auditLogs; // Admin sees all activity
    } else {
      // Trainer sees only activity from their assigned reps
      const currentTrainer = state.trainers.find(t => t.email === state.currentUser?.email);
      if (!currentTrainer) return [];
      
      const assignedRepIds = Array.isArray(currentTrainer.assignedRepIds) 
        ? currentTrainer.assignedRepIds as string[]
        : [];
      
      return state.auditLogs.filter(log => 
        assignedRepIds.includes(log.repId) || log.trainerId === state.currentUser?.id
      );
    }
  };

  const allActivity = getActivityForUser();

  // Filter activity based on action type
  const getFilteredActivity = () => {
    switch (activityFilter) {
      case 'rep_added':
        return allActivity.filter(log => log.action === 'rep_added');
      case 'milestone_completed':
        return allActivity.filter(log => log.action === 'milestone_completed');
      case 'stage_promoted':
        return allActivity.filter(log => log.action === 'stage_promoted');
      case 'subtask_completed':
        return allActivity.filter(log => log.action === 'subtask_completed');
      default:
        return allActivity;
    }
  };

  const filteredActivity = getFilteredActivity().sort((a, b) => 
    new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
  );

  // Get rep name by ID
  const getRepName = (repId: string) => {
    const rep = state.reps.find(r => r.id === repId);
    return rep?.name || 'Unknown Rep';
  };

  // Get trainer name by ID
  const getTrainerName = (trainerId: string) => {
    const trainer = state.trainers.find(t => t.id === trainerId);
    return trainer?.name || state.currentUser?.name || 'Unknown Trainer';
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'rep_added':
        return <UserPlus size={16} className="text-blue-500" />;
      case 'milestone_completed':
        return <Award size={16} className="text-green-500" />;
      case 'stage_promoted':
        return <CheckCircle size={16} className="text-purple-500" />;
      case 'subtask_completed':
        return <CheckCircle size={16} className="text-emerald-500" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  // Get action badge variant
  const getActionBadgeVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (action) {
      case 'rep_added':
        return 'default';
      case 'milestone_completed':
        return 'secondary';
      case 'stage_promoted':
        return 'default';
      case 'subtask_completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Format action text
  const formatActionText = (action: string) => {
    switch (action) {
      case 'rep_added':
        return 'Rep Added';
      case 'milestone_completed':
        return 'Milestone';
      case 'stage_promoted':
        return 'Promotion';
      case 'subtask_completed':
        return 'Subtask';
      default:
        return action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-semibold text-gray-900">
              Activity Log
            </h1>
            <p className="text-sm text-gray-600">
              {filteredActivity.length} of {allActivity.length} activities
            </p>
          </div>
          <Filter className="text-gray-400" size={20} />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Activity Type</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setActivityFilter('all')}
              variant={activityFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className={activityFilter === 'all' ? 'bg-primary-500 text-white' : ''}
            >
              All Activity
            </Button>
            <Button
              onClick={() => setActivityFilter('rep_added')}
              variant={activityFilter === 'rep_added' ? 'default' : 'outline'}
              size="sm"
              className={activityFilter === 'rep_added' ? 'bg-primary-500 text-white' : ''}
            >
              New Reps
            </Button>
            <Button
              onClick={() => setActivityFilter('milestone_completed')}
              variant={activityFilter === 'milestone_completed' ? 'default' : 'outline'}
              size="sm"
              className={activityFilter === 'milestone_completed' ? 'bg-primary-500 text-white' : ''}
            >
              Milestones
            </Button>
            <Button
              onClick={() => setActivityFilter('stage_promoted')}
              variant={activityFilter === 'stage_promoted' ? 'default' : 'outline'}
              size="sm"
              className={activityFilter === 'stage_promoted' ? 'bg-primary-500 text-white' : ''}
            >
              Promotions
            </Button>
            <Button
              onClick={() => setActivityFilter('subtask_completed')}
              variant={activityFilter === 'subtask_completed' ? 'default' : 'outline'}
              size="sm"
              className={activityFilter === 'subtask_completed' ? 'bg-primary-500 text-white' : ''}
            >
              Subtasks
            </Button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="px-4 pb-20 space-y-3">
        {filteredActivity.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <Clock className="mx-auto mb-3 text-gray-400" size={24} />
            <p className="text-gray-500 mb-2">No activity found</p>
            <p className="text-sm text-gray-400">
              {allActivity.length === 0 
                ? 'No activity has been recorded yet.' 
                : 'No activity matches the selected filter.'}
            </p>
          </div>
        ) : (
          filteredActivity.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(log.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                      {formatActionText(log.action)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(log.timestamp || new Date())}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2 leading-relaxed">
                    {log.description}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center space-x-1">
                      <User size={12} />
                      <span>Rep: {getRepName(log.repId)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User size={12} />
                      <span>Trainer: {getTrainerName(log.trainerId)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav activeTab="activity" />
    </div>
  );
}