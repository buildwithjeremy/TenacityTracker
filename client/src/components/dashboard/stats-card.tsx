import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  value: string | number;
  label: string;
  variant: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export default function StatsCard({ value, label, variant }: StatsCardProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'text-primary-600';
      case 'secondary':
        return 'text-secondary-600';
      case 'accent':
        return 'text-accent-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <div className={cn(
          "text-2xl font-heading font-bold mb-1",
          getVariantClasses(variant)
        )}>
          {value}
        </div>
        <div className="text-sm text-gray-600">{label}</div>
      </CardContent>
    </Card>
  );
}
