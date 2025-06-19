import { useLocation } from 'wouter';
import { useAppState } from '@/hooks/use-app-state';
import { Button } from '@/components/ui/button';
import { Home, Users, PlusCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: 'dashboard' | 'reps' | 'add' | 'activity';
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const [, navigate] = useLocation();
  const { state } = useAppState();

  const handleNavigation = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        const dashboardPath = state.userRole === 'admin' ? '/admin-dashboard' : '/trainer-dashboard';
        navigate(dashboardPath);
        break;
      case 'reps':
        // TODO: Implement dedicated reps view
        break;
      case 'add':
        // This will be handled by parent components opening the modal
        break;
      case 'activity':
        // TODO: Implement activity/audit log view
        break;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'reps', icon: Users, label: 'Reps' },
    { id: 'add', icon: PlusCircle, label: 'Add' },
    { id: 'activity', icon: Clock, label: 'Activity' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:hidden z-30">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              variant="ghost"
              className={cn(
                "flex flex-col items-center py-2 px-3 space-y-1 h-auto",
                isActive ? "text-primary-600" : "text-gray-400"
              )}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
