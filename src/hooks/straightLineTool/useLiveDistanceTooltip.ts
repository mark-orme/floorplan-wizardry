
import { useState, useEffect } from 'react';
import { MeasurementData } from '@/types/fabric-unified';

export const useLiveDistanceTooltip = (
  measurementData: MeasurementData | null,
  isDrawing: boolean
) => {
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Auto-hide tooltip after drawing ends
  useEffect(() => {
    if (isDrawing) {
      setShowTooltip(true);
    } else if (measurementData?.distance !== undefined) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isDrawing, measurementData]);

  const renderTooltip = () => {
    if (!showTooltip || !measurementData) return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          left: measurementData.midPoint.x,
          top: measurementData.midPoint.y,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none'
        }}
      >
        {Math.round(measurementData.distance)} {measurementData.unit}
        <br />
        {Math.round(measurementData.angle)}°
      </div>
    );
  };

  return {
    showTooltip,
    setShowTooltip,
    renderTooltip
  };
};
