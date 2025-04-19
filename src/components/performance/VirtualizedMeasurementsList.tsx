
import React from 'react';
import { PerformanceMeasurement } from '@/utils/performance';
import { VirtualizedList } from '@/components/VirtualizedList';

interface VirtualizedMeasurementsListProps {
  measurements: PerformanceMeasurement[];
}

export const VirtualizedMeasurementsList: React.FC<VirtualizedMeasurementsListProps> = ({ 
  measurements 
}) => {
  const renderMeasurementRow = (
    measurement: PerformanceMeasurement, 
    index: number, 
    style: React.CSSProperties
  ) => (
    <div style={style} className="flex border-b">
      <div className="py-2 w-1/3">{measurement.name}</div>
      <div className="py-2 w-1/3">{measurement.duration.toFixed(2)}ms</div>
      <div className="py-2 w-1/3">{new Date(measurement.startTime).toLocaleTimeString()}</div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex border-b font-medium bg-background">
        <div className="py-2 w-1/3">Operation</div>
        <div className="py-2 w-1/3">Duration</div>
        <div className="py-2 w-1/3">Time</div>
      </div>
      <VirtualizedList
        items={measurements}
        renderItem={renderMeasurementRow}
        itemHeight={36}
        maxHeight={200}
        className="border rounded-md"
      />
    </div>
  );
};
