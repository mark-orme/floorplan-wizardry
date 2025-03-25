import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus, canEditProperty } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Canvas } from '@/components/Canvas';
import { ArrowLeft, Check, Edit, Eye, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSyncedFloorPlans } from '@/hooks/useSyncedFloorPlans';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProperty, getProperty, updatePropertyStatus, isLoading } = usePropertyManagement();
  const { user, userRole } = useAuth();
  const { floorPlans, setFloorPlans, loadData } = useSyncedFloorPlans();
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      getProperty(id);
    }
  }, [id, getProperty]);

  useEffect(() => {
    if (currentProperty?.floor_plans && currentProperty.floor_plans.length > 0) {
      setFloorPlans(currentProperty.floor_plans);
    } else {
      loadData();
    }
  }, [currentProperty, setFloorPlans, loadData]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!currentProperty || !user) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Property not found</p>
        <Button onClick={() => navigate('/properties')} className="mt-4">
          Back to Properties
        </Button>
      </div>
    );
  }

  const canEdit = canEditProperty(currentProperty, userRole, user.id);
  
  const handleStatusChange = async (newStatus: PropertyStatus) => {
    if (id) {
      await updatePropertyStatus(id, newStatus);
      getProperty(id);
    }
  };

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.DRAFT:
        return <Badge variant="outline">Draft</Badge>;
      case PropertyStatus.PENDING_REVIEW:
        return <Badge variant="secondary">In Review</Badge>;
      case PropertyStatus.COMPLETED:
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/properties')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {currentProperty.order_id}
            <span className="text-base font-normal ml-2">
              {getStatusBadge(currentProperty.status)}
            </span>
          </h1>
          <p className="text-muted-foreground">{currentProperty.address}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
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
                  <p className="text-lg">{currentProperty.order_id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                  <p className="text-lg">{currentProperty.client_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p className="text-lg">{currentProperty.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Branch</h3>
                  <p className="text-lg">{currentProperty.branch_name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p className="text-lg">{new Date(currentProperty.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="text-lg">{new Date(currentProperty.updated_at).toLocaleString()}</p>
                </div>
              </div>

              {currentProperty.notes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                    <p className="text-base">{currentProperty.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div>
                {userRole === UserRole.MANAGER && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/properties/${id}/edit`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {userRole === UserRole.PHOTOGRAPHER && currentProperty.status === PropertyStatus.DRAFT && (
                  <Button 
                    onClick={() => handleStatusChange(PropertyStatus.PENDING_REVIEW)}
                    size="sm"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Review
                  </Button>
                )}
                {userRole === UserRole.PROCESSING_MANAGER && currentProperty.status === PropertyStatus.PENDING_REVIEW && (
                  <Button 
                    onClick={() => handleStatusChange(PropertyStatus.COMPLETED)}
                    variant="default"
                    size="sm"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
                {userRole === UserRole.MANAGER && currentProperty.status !== PropertyStatus.DRAFT && (
                  <Button 
                    onClick={() => handleStatusChange(PropertyStatus.DRAFT)}
                    variant="outline"
                    size="sm"
                  >
                    Return to Draft
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="floorplan" className="space-y-4">
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
                  {userRole === UserRole.PHOTOGRAPHER && currentProperty.status === PropertyStatus.DRAFT && (
                    <Button 
                      onClick={() => handleStatusChange(PropertyStatus.PENDING_REVIEW)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit for Review
                    </Button>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyDetail;
