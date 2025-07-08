import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface SelectionCardProps {
  selected?: boolean;
  onClick?: () => void;
  title: string;
  icon?: ReactNode;
  className?: string;
  description?: string;
}

export function SelectionCard({ 
  selected = false, 
  onClick, 
  title, 
  icon, 
  className,
  description
}: SelectionCardProps) {
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        selected ? 'border-2 border-primary' : 'border border-border hover:border-primary/30',
        className
      )}
      onClick={onClick}
      hoverable
    >
      <div className="p-6 flex flex-col items-center text-center">
        {icon && (
          <div className={cn(
            'mb-3 text-4xl',
            selected ? 'text-primary' : 'text-muted-foreground'
          )}>
            {icon}
          </div>
        )}
        <h3 className={cn(
          'font-semibold text-lg mb-1',
          selected ? 'text-primary' : 'text-foreground'
        )}>{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
}