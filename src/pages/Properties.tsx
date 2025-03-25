
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';
import { PropertyStatus } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { insertTestData } from '@/utils/supabaseSetup';

const Properties = () => {
  const { properties, isLoading, listProperties } = usePropertyManagement();
  const { userRole, hasAccess, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load properties when component mounts
    listProperties();
  }, [listProperties]);

  const handleRowClick = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const handleAddProperty = async () => {
    // Normal behavior - navigate to property form
    navigate('/properties/new');
  };

  const handleAddTestData = async () => {
    await insertTestData();
    // Refresh the list after adding test data
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

  const shouldShowCreateButton = userRole === UserRole.PHOTOGRAPHER || 
                               userRole === UserRole.MANAGER || 
                               hasAccess([UserRole.PHOTOGRAPHER, UserRole.MANAGER]);

  console.log('Current user role:', userRole);
  console.log('Should show create button:', shouldShowCreateButton);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            {userRole === UserRole.PHOTOGRAPHER && 'Manage your properties'}
            {userRole === UserRole.PROCESSING_MANAGER && 'Properties waiting for review'}
            {userRole === UserRole.MANAGER && 'All properties in the system'}
          </p>
        </div>

        <div className="flex space-x-3">
          {(userRole === UserRole.PHOTOGRAPHER || userRole === UserRole.MANAGER) && (
            <Button onClick={handleAddProperty}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Property
            </Button>
          )}
          
          {/* Add Test Data button (now contextual based on environment) */}
          {!properties.length && (userRole === UserRole.PHOTOGRAPHER || userRole === UserRole.MANAGER) && (
            <Button onClick={handleAddTestData} variant="outline">
              Add Test Data
            </Button>
          )}
        </div>
      </div>

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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'No properties match your search' 
              : 'No properties found. Create your first property!'}
          </p>
          {!searchTerm && (userRole === UserRole.PHOTOGRAPHER || userRole === UserRole.MANAGER) && (
            <div className="mt-4 flex justify-center gap-3">
              <Button 
                variant="outline" 
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
            </div>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Properties;
