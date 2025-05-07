
import { useState, useEffect } from 'react';
import { MeasurementData } from '@/types/measurement/MeasurementData';
import { Point } from '@/types/core/Point';

export const useLiveDistanceTooltip = (
  measurementData: MeasurementData | null,
  isDrawing: boolean
) => {
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Auto-hide tooltip after drawing ends
  useEffect(() => {
    if (isDrawing) {
      setShowTooltip(true);
    } else if (measurementData?.distance !== null && measurementData?.distance !== undefined) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isDrawing, measurementData]);

  const renderTooltip = () => {
    if (!showTooltip || !measurementData) return null;
    
    // Get midpoint from measurement data or calculate if missing
    const midPoint: Point = measurementData.midPoint || {
      x: measurementData.startPoint && measurementData.endPoint ? 
        (measurementData.startPoint.x + measurementData.endPoint.x) / 2 : 0,
      y: measurementData.startPoint && measurementData.endPoint ? 
        (measurementData.startPoint.y + measurementData.endPoint.y) / 2 : 0
    };
    
    return {
      position: 'absolute',
      left: midPoint.x,
      top: midPoint.y,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      transform: 'translate(-50%, -100%)',
      pointerEvents: 'none',
      content: `${Math.round(measurementData.distance || 0)} ${measurementData.unit || measurementData.units || 'px'}
              ${Math.round(measurementData.angle || 0)}°`
    };
  };

  return {
    showTooltip,
    setShowTooltip,
    renderTooltip
  };
};
