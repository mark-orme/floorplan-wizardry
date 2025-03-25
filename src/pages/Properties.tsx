
import { useEffect } from 'react';
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
import { useState } from 'react';

const Properties = () => {
  const { properties, isLoading, listProperties } = usePropertyManagement();
  const { userRole, hasAccess } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    listProperties();
  }, [listProperties]);

  const handleRowClick = (id: string) => {
    navigate(`/properties/${id}`);
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

        {hasAccess([UserRole.PHOTOGRAPHER]) && (
          <Button onClick={() => navigate('/properties/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Property
          </Button>
        )}
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
          {!searchTerm && hasAccess([UserRole.PHOTOGRAPHER]) && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/properties/new')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Property
            </Button>
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
