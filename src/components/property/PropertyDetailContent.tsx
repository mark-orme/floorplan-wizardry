import React from 'react';
import { Icons } from '@/components/icons';
import LoadingErrorWrapper from '@/components/LoadingErrorWrapper';
import { PropertyDetailsTab } from './PropertyDetailsTab';
import { PropertyFloorPlanTab } from './PropertyFloorPlanTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyStatus, UserRole } from '@/types/roles';

interface PropertyDetailContentProps {
  property: {
    id: string;
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
  isLoading: boolean;
  error: Error | null;
  onStatusChange: (status: PropertyStatus) => Promise<void>;
  onMeasurementGuideOpen?: () => void;
}

export const PropertyDetailContent: React.FC<PropertyDetailContentProps> = ({
  property,
  userRole,
  isLoading,
  error,
  onStatusChange,
  onMeasurementGuideOpen
}) => {
  return (
    <LoadingErrorWrapper isLoading={isLoading} error={error}>
      <Tabs defaultValue="details" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <Icons.home className="w-4 h-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="floorplan">
            <Icons.grid className="w-4 h-4 mr-2" />
            Floor Plan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <PropertyDetailsTab
            property={property}
            userRole={userRole}
            propertyId={property.id}
            onStatusChange={onStatusChange}
          />
        </TabsContent>
        <TabsContent value="floorplan">
          <PropertyFloorPlanTab
            canEdit={userRole === UserRole.MANAGER}
            isApprovedUser={userRole === UserRole.MANAGER || userRole === UserRole.ADMIN}
            propertyStatus={property.status}
            onMeasurementGuideOpen={onMeasurementGuideOpen}
          />
        </TabsContent>
      </Tabs>
    </LoadingErrorWrapper>
  );
};
