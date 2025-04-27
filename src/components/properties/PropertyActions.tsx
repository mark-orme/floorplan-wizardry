
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowRight } from 'lucide-react';

interface PropertyActionsProps {
  onAddNew: () => void;
  onViewAll?: () => void;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({
  onAddNew,
  onViewAll
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="default" size="sm" onClick={onAddNew} className="flex items-center gap-2">
        <PlusCircle size={16} />
        Add Property
      </Button>
      
      {onViewAll && (
        <Button variant="outline" size="sm" onClick={onViewAll} className="flex items-center gap-2">
          <ArrowRight size={16} />
          View All
        </Button>
      )}
    </div>
  );
};
