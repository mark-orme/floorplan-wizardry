import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, LogIn, ArrowLeftRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { insertTestData } from '@/utils/supabaseSetup';
import { toast } from 'sonner';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';

const Properties = () => {
  const { properties, isLoading, listProperties } = usePropertyManagement();
  const { userRole, hasAccess, user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      listProperties().catch(error => {
        console.error("Error fetching properties:", error);
        setHasError(true);
        setErrorMessage("Failed to load properties");
      });
    }
  }, [listProperties, user]);

  const handleRowClick = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const handleAddProperty = async () => {
    if (!user) {
      toast.info('Please sign in to create a new property');
      navigate('/auth', { state: { returnTo: '/properties/new' } });
      return;
    }
    
    navigate('/properties/new');
  };

  const handleGoToFloorplans = () => {
    navigate('/floorplans');
  };

  const handleAddTestData = async () => {
    if (!user) {
      toast.info('Please sign in to add test data');
      navigate('/auth', { state: { returnTo: '/properties' } });
      return;
    }
    
    try {
      await insertTestData();
      toast.success('Test data added successfully');
      listProperties();
    } catch (error) {
      console.error('Error adding test data:', error);
      toast.error('Failed to add test data');
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    listProperties();
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

  const filteredProperties = properties.filter(prop => {
    const searchLower = searchTerm.toLowerCase();
    return (
      prop.order_id.toLowerCase().includes(searchLower) ||
      prop.address.toLowerCase().includes(searchLower) ||
      prop.client_name.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <h2 className="text-2xl font-bold mb-4">Welcome to Property Management</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sign in to manage your properties, create floor plans, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/auth')}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button variant="outline" onClick={handleGoToFloorplans}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Go to Floor Plan Editor
            </Button>
          </div>
        </div>
      );
    }

    if (filteredProperties.length === 0) {
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
                onClick={handleAddProperty}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Property
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleAddTestData}
              >
                Add Test Data
              </Button>
              <Button
                variant="outline"
                onClick={handleGoToFloorplans}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Go to Floor Plan Editor
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Property Address</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow 
                key={property.id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleRowClick(property.id)}
              >
                <TableCell className="font-medium">{property.order_id}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>{property.client_name}</TableCell>
                <TableCell>{getStatusBadge(property.status)}</TableCell>
                <TableCell>{formatDate(property.updated_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            {!user && 'Sign in to manage properties'}
            {user && userRole === UserRole.PHOTOGRAPHER && 'Manage your properties'}
            {user && userRole === UserRole.PROCESSING_MANAGER && 'Properties waiting for review'}
            {user && userRole === UserRole.MANAGER && 'All properties in the system'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleAddProperty}>
            {!user ? (
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
            onClick={handleGoToFloorplans}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Floor Plan Editor
          </Button>
        </div>
      </div>

      {user && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, address or client..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <LoadingErrorWrapper
        isLoading={isLoading || (user && authLoading)}
        hasError={hasError}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      >
        {renderContent()}
      </LoadingErrorWrapper>
    </div>
  );
};

export default Properties;
