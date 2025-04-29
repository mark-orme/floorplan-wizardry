
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { PropertyStatus } from '@/types/floorPlanTypes';

interface PropertyDetailsTabProps {
  name: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  status: PropertyStatus;
  description: string;
}

export const PropertyDetailsTab: React.FC<PropertyDetailsTabProps> = ({
  name,
  address,
  price,
  bedrooms,
  bathrooms,
  squareFootage,
  status,
  description
}) => {
  // Determine badge color based on status
  const getBadgeColor = (status: PropertyStatus): string => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'under_construction':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-gray-500">{address}</p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className={getBadgeColor(status)}>
            {status === 'under_construction' ? 'Under Construction' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <span className="font-bold text-lg">{price}</span>
        </div>
      </div>
      
      <Card>
        <CardContent className="grid grid-cols-3 gap-4 py-4">
          <div>
            <Label className="text-gray-500">Bedrooms</Label>
            <p className="text-lg font-medium">{bedrooms}</p>
          </div>
          <div>
            <Label className="text-gray-500">Bathrooms</Label>
            <p className="text-lg font-medium">{bathrooms}</p>
          </div>
          <div>
            <Label className="text-gray-500">Square Footage</Label>
            <p className="text-lg font-medium">{squareFootage} sq ft</p>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};
