
import { Badge } from '@/components/ui/badge';
import { PropertyStatus } from '@/types/propertyTypes';

interface PropertyHeaderProps {
  property: {
    order_id: string;
    status: PropertyStatus;
    address: string;
  };
}

export const PropertyHeader = ({ property }: PropertyHeaderProps) => {
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
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-2">
        {property.order_id}
        <span className="text-base font-normal ml-2">
          {getStatusBadge(property.status)}
        </span>
      </h1>
      <p className="text-muted-foreground">{property.address}</p>
    </div>
  );
};
