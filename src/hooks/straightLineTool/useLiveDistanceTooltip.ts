
import { useCallback } from 'react';
import { MeasurementData } from '../useStraightLineTool.d';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';
import { Point } from '@/types/core/Point';

interface UseLiveDistanceTooltipProps {
  measurementData: MeasurementData;
}

export const useLiveDistanceTooltip = ({ measurementData }: UseLiveDistanceTooltipProps) => {
  const renderTooltip = useCallback(() => {
    if (!measurementData.distance) return null;
    
    const distanceDisplay = `${measurementData.distance.toFixed(1)} ${measurementData.unit}`;
    const angleDisplay = measurementData.angle !== null
      ? `${measurementData.angle.toFixed(1)}°`
      : '';
    
    const snappedInfo = measurementData.snapped 
      ? `(Snapped${measurementData.snapType ? ` to ${measurementData.snapType}` : ''})`
      : '';
    
    return (
      <div className="absolute p-2 bg-white border rounded shadow text-xs">
        <div>Distance: {distanceDisplay}</div>
        {angleDisplay && <div>Angle: {angleDisplay}</div>}
        {snappedInfo && <div className="text-gray-500">{snappedInfo}</div>}
      </div>
    );
  }, [measurementData]);
  
  return {
    renderTooltip
  };
};
