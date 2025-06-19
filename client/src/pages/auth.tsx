import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAppState } from '@/hooks/use-app-state';
import { authService } from '@/services/auth';
import GoogleSignIn from '@/components/auth/google-sign-in';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { state, dispatch } = useAppState();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (state.isAuthenticated) {
    navigate('/role-selector');
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      dispatch({ type: 'SIGN_IN', payload: user });
      navigate('/role-selector');
    } catch (error) {
      console.error('Sign in failed:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white text-2xl" size={32} />
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Team Tenacious
            </h1>
            <p className="text-gray-600 font-body">
              Field Trainer Progress Hub
            </p>
          </div>
          
          <GoogleSignIn 
            onClick={handleGoogleSignIn}
            isLoading={isLoading}
          />
          
          <div className="text-sm text-gray-500 mt-6">
            <p>For Field Trainers and Administrators</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
