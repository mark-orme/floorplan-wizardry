
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Canvas } from '@/components/Canvas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Send } from 'lucide-react';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus } from '@/types/propertyTypes';
import { CanvasControllerProvider } from '@/components/canvas/controller/CanvasController';
import { useEffect, useState } from 'react';

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
  const [isReady, setIsReady] = useState(false);
  const [initAttempt, setInitAttempt] = useState(0); // Track initialization attempts
  
  // Set ready state after a short delay to ensure DOM is fully rendered
  useEffect(() => {
    // Unmount any existing canvas before trying to render a new one
    setIsReady(false);
    
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500); // Increased from 300ms to 500ms to ensure proper DOM setup
    
    return () => clearTimeout(timer);
  }, []);
  
  // Provide a retry mechanism if canvas initialization fails
  const handleCanvasRetry = () => {
    setIsReady(false);
    setInitAttempt(prev => prev + 1);
    
    // Try to re-initialize after a delay
    setTimeout(() => {
      setIsReady(true);
    }, 800);
  };
  
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
        <div 
          className="h-[800px] w-full" 
          data-testid="floor-plan-wrapper"
          data-canvas-ready={isReady ? "true" : "false"}
          data-init-attempt={initAttempt}
        > 
          {isReady && (
            <CanvasControllerProvider key={`canvas-${initAttempt}`}>
              <Canvas data-readonly={!canEdit} />
            </CanvasControllerProvider>
          )}
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
