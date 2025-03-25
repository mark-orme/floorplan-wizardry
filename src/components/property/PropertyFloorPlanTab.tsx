
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Canvas } from '@/components/Canvas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Send } from 'lucide-react';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus } from '@/types/propertyTypes';

interface PropertyFloorPlanTabProps {
  canEdit: boolean;
  userRole: UserRole;
  property: {
    status: PropertyStatus;
  };
  isSubmitting: boolean;
  onStatusChange: (status: PropertyStatus) => Promise<void>;
}

export const PropertyFloorPlanTab = ({
  canEdit,
  userRole,
  property,
  isSubmitting,
  onStatusChange
}: PropertyFloorPlanTabProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle>Floor Plan</CardTitle>
        <CardDescription>
          {canEdit 
            ? 'Edit the floor plan for this property' 
            : 'View the floor plan for this property'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[700px] w-full">
          <Canvas data-readonly={!canEdit} />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div>
            {!canEdit && (
              <Badge variant="outline" className="flex items-center">
                <Eye className="mr-1 h-3 w-3" />
                View Only
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            {userRole === UserRole.PHOTOGRAPHER && property.status === PropertyStatus.DRAFT && (
              <Button 
                onClick={() => onStatusChange(PropertyStatus.PENDING_REVIEW)}
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
