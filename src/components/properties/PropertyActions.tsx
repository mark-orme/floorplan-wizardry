
import { Button } from '@/components/ui/button';
import { PlusCircle, LogIn, ArrowLeftRight } from 'lucide-react';
import { UserRole } from '@/lib/supabase';

interface PropertyActionsProps {
  isAuthenticated: boolean;
  userRole?: UserRole | null;
  onAddProperty: () => void;
  onGoToFloorplans: () => void;
}

export const PropertyActions = ({ 
  isAuthenticated, 
  userRole, 
  onAddProperty, 
  onGoToFloorplans 
}: PropertyActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onAddProperty}>
        {!isAuthenticated ? (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign in to Create
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Property
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onGoToFloorplans}
      >
        <ArrowLeftRight className="mr-2 h-4 w-4" />
        Floor Plan Editor
      </Button>
    </div>
  );
};
