
import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Badge } from '@/components/ui/badge';
import { PropertyListItem, PropertyStatus } from '@/types/propertyTypes';

interface PropertyListProps {
  properties: PropertyListItem[];
  onRowClick: (id: string) => void;
  maxHeight?: number;
}

export const PropertyList = ({ 
  properties, 
  onRowClick,
  maxHeight = 600
}: PropertyListProps) => {
  const ITEM_HEIGHT = 64; // Height for each property row
  const LIST_HEIGHT = Math.min(properties.length * ITEM_HEIGHT + 40, maxHeight);

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
  
  // Table header component
  const TableHeader = () => (
    <div className="grid grid-cols-5 gap-4 px-4 py-3 font-medium text-sm border-b bg-muted/40">
      <div>Order ID</div>
      <div>Property Address</div>
      <div>Client</div>
      <div>Status</div>
      <div>Last Updated</div>
    </div>
  );
  
  // Memoized row renderer
  const renderRow = useMemo(() => {
    return function RowRenderer({ index, style }: { index: number; style: React.CSSProperties }) {
      const property = properties[index];
      if (!property) return null;
      
      return (
        <div 
          style={style}
          className="grid grid-cols-5 gap-4 px-4 py-3 border-b cursor-pointer hover:bg-accent/50"
          onClick={() => onRowClick(property.id)}
          role="row"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onRowClick(property.id);
              e.preventDefault();
            }
          }}
        >
          <div className="font-medium truncate">{property.order_id}</div>
          <div className="truncate">{property.address}</div>
          <div className="truncate">{property.client_name}</div>
          <div>{getStatusBadge(property.status)}</div>
          <div>{formatDate(property.updated_at)}</div>
        </div>
      );
    };
  }, [properties, onRowClick]);

  if (properties.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        No properties found. Add a property to get started.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: LIST_HEIGHT }}>
      <TableHeader />
      <div style={{ height: LIST_HEIGHT - 40 }}>
        <AutoSizer>
          {({ width, height }) => (
            <FixedSizeList
              height={height}
              itemCount={properties.length}
              itemSize={ITEM_HEIGHT}
              width={width}
              className="scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
              overscanCount={5}
              role="table"
            >
              {renderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
