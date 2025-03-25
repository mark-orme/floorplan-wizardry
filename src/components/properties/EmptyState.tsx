
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeftRight } from 'lucide-react';

interface EmptyStateProps {
  searchTerm: string;
  onAddProperty: () => void;
  onAddTestData: () => void;
  onGoToFloorplans: () => void;
}

export const EmptyState = ({ 
  searchTerm, 
  onAddProperty, 
  onAddTestData, 
  onGoToFloorplans 
}: EmptyStateProps) => {
  return (
    <div className="text-center py-8 border rounded-lg bg-muted/50">
      <p className="text-muted-foreground">
        {searchTerm 
          ? 'No properties match your search' 
          : 'No properties found. Create your first property!'}
      </p>
      {!searchTerm && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button 
            variant="default" 
            onClick={onAddProperty}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Property
          </Button>
          <Button 
            variant="secondary" 
            onClick={onAddTestData}
          >
            Add Test Data
          </Button>
          <Button
            variant="outline"
            onClick={onGoToFloorplans}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Go to Floor Plan Editor
          </Button>
        </div>
      )}
    </div>
  );
};
