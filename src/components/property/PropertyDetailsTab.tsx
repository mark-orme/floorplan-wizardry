
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { PropertyStatus } from '@/types/canvas-types';
import { useNavigate } from 'react-router-dom';

// Define UserRole type
export type UserRole = 'admin' | 'manager' | 'user' | 'guest' | 'photographer' | 'processing_manager';

// Export as a constant for usage as values
export const UserRole = {
  ADMIN: 'admin' as UserRole,
  MANAGER: 'manager' as UserRole,
  USER: 'user' as UserRole,
  GUEST: 'guest' as UserRole,
  PHOTOGRAPHER: 'photographer' as UserRole,
  PROCESSING_MANAGER: 'processing_manager' as UserRole
};

interface PropertyDetailsTabProps {
  property: {
    order_id: string;
    client_name: string;
    address: string;
    branch_name?: string;
    created_at: string;
    updated_at: string;
    notes?: string;
    status: PropertyStatus;
  };
  userRole: UserRole;
  propertyId?: string;
  onStatusChange: (status: PropertyStatus) => Promise<void>;
}

export const PropertyDetailsTab = ({ 
  property, 
  userRole, 
  propertyId, 
  onStatusChange 
}: PropertyDetailsTabProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
        <CardDescription>
          Details about this property and order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Order ID</h3>
            <p className="text-lg">{property.order_id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
            <p className="text-lg">{property.client_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
            <p className="text-lg">{property.address}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Branch</h3>
            <p className="text-lg">{property.branch_name || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
            <p className="text-lg">{new Date(property.created_at).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
            <p className="text-lg">{new Date(property.updated_at).toLocaleString()}</p>
          </div>
        </div>

        {property.notes && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <p className="text-base">{property.notes}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div>
          {userRole === UserRole.MANAGER && propertyId && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/properties/${propertyId}/edit`)}
            >
              <Icons.pencil className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {userRole === UserRole.PHOTOGRAPHER && property.status === PropertyStatus.DRAFT && (
            <Button 
              onClick={() => onStatusChange(PropertyStatus.PENDING_REVIEW)}
              size="sm"
            >
              <Icons.send className="mr-2 h-4 w-4" />
              Submit for Review
            </Button>
          )}
          {userRole === UserRole.PROCESSING_MANAGER && property.status === PropertyStatus.PENDING_REVIEW && (
            <Button 
              onClick={() => onStatusChange(PropertyStatus.COMPLETED)}
              variant="default"
              size="sm"
            >
              <Icons.checkCircle className="mr-2 h-4 w-4" />
              Mark as Completed
            </Button>
          )}
          {userRole === UserRole.MANAGER && property.status !== PropertyStatus.DRAFT && (
            <Button 
              onClick={() => onStatusChange(PropertyStatus.DRAFT)}
              variant="outline"
              size="sm"
            >
              Return to Draft
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
