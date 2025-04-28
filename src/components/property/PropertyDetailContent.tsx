import React from 'react';
import { Icons } from '@/components/icons';

interface PropertyDetailContentProps {
  property: {
    address: string;
    area: number;
    orderId: string;
    clientName: string;
    price: number;
    status: string;
    location: string;
    isActive: boolean;
  };
  onEdit: () => void;
}

export const PropertyDetailContent: React.FC<PropertyDetailContentProps> = ({
  property,
  onEdit
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Icons.home className="h-5 w-5" />
        <h2 className="text-xl font-semibold">{property.address}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Icons.grid className="h-4 w-4 mb-1" />
          <span className="text-sm text-gray-600">Area</span>
          <p>{property.area} sqm</p>
        </div>
        <div>
          <Icons.key className="h-4 w-4 mb-1" />
          <span className="text-sm text-gray-600">Order ID</span>
          <p>{property.orderId}</p>
        </div>
        <div>
          <Icons.send className="h-4 w-4 mb-1" />
          <span className="text-sm text-gray-600">Client Name</span>
          <p>{property.clientName}</p>
        </div>
        <div>
          <Icons.plusCircle className="h-4 w-4 mb-1" />
          <span className="text-sm text-gray-600">Price</span>
          <p>${property.price}</p>
        </div>
        <div>
          <Icons.checkCircle className="h-4 w-4 mb-1" />
          <span className="text-sm text-gray-600">Status</span>
          <p>{property.status}</p>
        </div>
        <div>
          <Icons.arrowRightLeft className="h-4 w-4 mb-1" />
          <span className="text-sm text-gray-600">Location</span>
          <p>{property.location}</p>
        </div>
        <div>
          <Icons.shield className="h-4 w-4 mb-1" />
          <span className="text-sm text-gray-600">Is Active</span>
          <p>{property.isActive ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};
