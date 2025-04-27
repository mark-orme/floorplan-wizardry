import React from 'react';
import { AiOutlineAppstore as Grid, AiOutlineHome as Home } from 'react-icons/ai';
import LoadingErrorWrapper from '@/components/LoadingErrorWrapper';
import { type UserRole } from '@/types/roles';
import { PropertyDetailsTab } from './PropertyDetailsTab';
import { PropertyFloorPlanTab } from './PropertyFloorPlanTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyStatus } from '@/types/propertyTypes';

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

interface PropertyFloorPlanTabProps {
  canEdit?: boolean;
  isApprovedUser?: boolean;
  propertyStatus?: PropertyStatus;
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
  const isApprovedUser = userRole === 'manager' || userRole === 'admin';
  const canEdit = userRole === 'manager';

  return (
    <LoadingErrorWrapper isLoading={isLoading} error={error}>
      <Tabs defaultValue="details" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
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
            isApprovedUser={isApprovedUser}
            propertyStatus={property.status}
            onMeasurementGuideOpen={onMeasurementGuideOpen}
          />
        </TabsContent>
      </Tabs>
    </LoadingErrorWrapper>
  );
};
