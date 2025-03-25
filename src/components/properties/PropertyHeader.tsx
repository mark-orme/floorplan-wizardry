
import { UserRole } from '@/lib/supabase';
import { PropertyActions } from './PropertyActions';

interface PropertyHeaderProps {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  onAddProperty: () => void;
  onGoToFloorplans: () => void;
}

export const PropertyHeader = ({ 
  isAuthenticated, 
  userRole, 
  onAddProperty, 
  onGoToFloorplans 
}: PropertyHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Properties</h1>
        <p className="text-muted-foreground">
          {!isAuthenticated && 'Sign in to manage properties'}
          {isAuthenticated && userRole === UserRole.PHOTOGRAPHER && 'Manage your properties'}
          {isAuthenticated && userRole === UserRole.PROCESSING_MANAGER && 'Properties waiting for review'}
          {isAuthenticated && userRole === UserRole.MANAGER && 'All properties in the system'}
        </p>
      </div>

      <PropertyActions 
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onAddProperty={onAddProperty}
        onGoToFloorplans={onGoToFloorplans}
      />
    </div>
  );
};
