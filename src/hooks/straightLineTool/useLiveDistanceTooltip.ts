
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { MeasurementData } from './types';
import React from 'react';

export const useLiveDistanceTooltip = () => {
  const formatTooltipData = useCallback((measurementData: MeasurementData | null) => {
    if (!measurementData || measurementData.distance === null) {
      return null;
    }
    
    const distanceDisplay = `${measurementData.distance.toFixed(2)} ${measurementData.unit}`;
    const angleDisplay = measurementData.angle !== null ? `${measurementData.angle.toFixed(1)}°` : '';
    const snappedInfo = measurementData.snapped ? ' (Snapped)' : '';
    
    return { distanceDisplay, angleDisplay, snappedInfo };
  }, []);

  const renderTooltip = useCallback(() => {
    // This returns a React node for tooltip rendering
    return React.createElement('div', { className: 'tooltip' }, 'Measurement');
  }, []);
  
  return {
    formatTooltipData,
    renderTooltip
  };
};
