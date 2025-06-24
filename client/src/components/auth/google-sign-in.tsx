import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GoogleSignInProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function GoogleSignIn({ onClick, isLoading }: GoogleSignInProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-white border-2 border-gray-200 rounded-lg py-4 px-6 flex items-center justify-center space-x-3 hover:border-gray-300 hover:shadow-md transition-all duration-200 mb-6 h-auto text-gray-700 hover:text-gray-700"
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <img 
          src="https://developers.google.com/identity/images/g-logo.png" 
          alt="Google" 
          className="w-5 h-5" 
        />
      )}
      <span className="font-heading font-medium">
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </span>
    </Button>
  );
}
