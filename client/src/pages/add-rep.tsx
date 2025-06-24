import { useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ArrowLeft } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { zapierService } from '@/services/zapier-placeholder';
import { useToast } from '@/hooks/use-toast';
import TopNav from '@/components/navigation/top-nav';
import BottomNav from '@/components/navigation/bottom-nav';

export default function AddRepPage() {
  const [, navigate] = useLocation();
  const { state, dispatch } = useAppState();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fieldTrainerId: ''
  });

  // Redirect if not authenticated
  if (!state.isAuthenticated) {
    navigate('/');
    return null;
  }

  if (!state.userRole) {
    navigate('/role-selector');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine trainer ID
      let trainerId = formData.fieldTrainerId;
      if (state.userRole === 'trainer') {
        // For trainers, assign to themselves
        const currentTrainer = state.trainers.find(t => t.email === state.currentUser?.email);
        trainerId = currentTrainer?.id || '';
      }

      if (!trainerId) {
        toast({
          title: "Error",
          description: "Please select a trainer",
          variant: "destructive"
        });
        return;
      }

      // Create new rep
      const newRep = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        fieldTrainerId: trainerId,
        stage: 1,
        promotionDate: null,
        milestones: []
      };

      dispatch({ type: 'ADD_REP', payload: newRep });

      // Add audit log
      dispatch({
        type: 'ADD_AUDIT_LOG',
        payload: {
          repId: '', // Will be filled by reducer
          trainerId: state.currentUser?.id || '',
          action: 'rep_added',
          description: `Added new rep: ${formData.name}`
        }
      });

      // TODO: Trigger welcome message via EZTexting/Zapier
      if (state.currentUser) {
        await zapierService.triggerNewRepWelcome(newRep as any, state.currentUser);
      }

      toast({
        title: "Success",
        description: `${formData.name} has been added successfully!`
      });

      // Navigate back to dashboard
      const dashboardPath = state.userRole === 'admin' ? '/admin-dashboard' : '/trainer-dashboard';
      navigate(dashboardPath);

    } catch (error) {
      console.error('Failed to add rep:', error);
      toast({
        title: "Error",
        description: "Failed to add representative. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const dashboardPath = state.userRole === 'admin' ? '/admin-dashboard' : '/trainer-dashboard';
    navigate(dashboardPath);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-heading font-semibold text-gray-900">
                Add New Rep
              </h1>
              <p className="text-sm text-gray-600">Create a new representative profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 pb-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className="w-full"
              />
            </div>
            
            {state.userRole === 'admin' && (
              <div>
                <Label htmlFor="trainer" className="text-sm font-medium text-gray-700 mb-2">
                  Assign to Trainer
                </Label>
                <Select
                  value={formData.fieldTrainerId}
                  onValueChange={(value) => handleInputChange('fieldTrainerId', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.trainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? 'Adding Representative...' : 'Add Representative'}
              </Button>
              
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="w-full py-3 px-4 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      <BottomNav activeTab="add" />
    </div>
  );
}