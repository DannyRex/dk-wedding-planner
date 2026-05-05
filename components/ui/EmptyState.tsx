import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="w-14 h-14 rounded-2xl bg-champagne-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-champagne-400" />
      </div>
      <h3 className="font-serif text-lg font-medium text-stone-600 mb-1">{title}</h3>
      <p className="text-sm text-stone-400 max-w-xs leading-relaxed mb-4">{description}</p>
      {action}
    </div>
  );
}
