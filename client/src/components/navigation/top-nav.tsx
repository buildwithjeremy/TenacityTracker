import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Users, LogOut } from 'lucide-react';
import { authService } from '@/services/auth';

export default function TopNav() {
  const [, navigate] = useLocation();
  const { state, dispatch } = useAppState();

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      dispatch({ type: 'SIGN_OUT' });
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Users className="text-white" size={16} />
            </div>
            <span className="font-heading font-semibold text-gray-900">
              Team Tenacious
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {state.currentUser?.name?.[0] || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {state.currentUser?.name || 'User'}
              </span>
            </div>
            
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
