
import React from 'react';
import VirtualizedList from "@/components/VirtualizedList";

interface Measurement {
  id: string;
  value: number;
  unit: string;
  timestamp: Date;
}

interface VirtualizedMeasurementsListProps {
  measurements: Measurement[];
  height?: number;
}

export const VirtualizedMeasurementsList: React.FC<VirtualizedMeasurementsListProps> = ({
  measurements,
  height = 300
}) => {
  return (
    <VirtualizedList 
      data={measurements}
      height={height}
      rowHeight={40}
      renderRow={(item) => (
        <div className="flex justify-between p-2 border-b">
          <span>{item.value} {item.unit}</span>
          <span>{item.timestamp.toLocaleString()}</span>
        </div>
      )}
    />
  );
};
