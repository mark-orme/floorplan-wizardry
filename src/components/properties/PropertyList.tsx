
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PropertyListItem, PropertyStatus } from '@/types/propertyTypes';

interface PropertyListProps {
  properties: PropertyListItem[];
  onRowClick: (id: string) => void;
}

export const PropertyList = ({ properties, onRowClick }: PropertyListProps) => {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
          {properties.map((property) => property && (
            <TableRow 
              key={property.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onRowClick(property.id)}
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
