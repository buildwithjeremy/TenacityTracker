import { useLocation } from 'wouter';
import { useAppState } from '@/hooks/use-app-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Crown } from 'lucide-react';
import TopNav from '@/components/navigation/top-nav';

export default function RoleSelectorPage() {
  const [, navigate] = useLocation();
  const { state, dispatch } = useAppState();

  // Redirect if not authenticated
  if (!state.isAuthenticated) {
    navigate('/');
    return null;
  }

  // Redirect if role already selected
  if (state.userRole) {
    const dashboardPath = state.userRole === 'admin' ? '/admin-dashboard' : '/trainer-dashboard';
    navigate(dashboardPath);
    return null;
  }

  const handleRoleSelection = (role: 'trainer' | 'admin') => {
    dispatch({ type: 'SET_ROLE', payload: role });
    const dashboardPath = role === 'admin' ? '/admin-dashboard' : '/trainer-dashboard';
    navigate(dashboardPath);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="p-4 max-w-lg mx-auto mt-8">
        <Card className="bg-white rounded-xl shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6 text-center">
              Select Your Role
            </h2>
            
            <div className="space-y-4">
              <Button
                onClick={() => handleRoleSelection('trainer')}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-lg py-4 px-6 flex items-center justify-center space-x-3 transition-colors duration-200 h-auto"
              >
                <UserCheck size={24} />
                <span className="font-heading font-medium">Field Trainer</span>
              </Button>
              
              <Button
                onClick={() => handleRoleSelection('admin')}
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg py-4 px-6 flex items-center justify-center space-x-3 transition-colors duration-200 h-auto"
              >
                <Crown size={24} />
                <span className="font-heading font-medium">Administrator</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
