
import { useEffect, useState } from 'react';
import { MeasurementData } from '@/types/fabric-unified';
import { GRID_CONSTANTS } from '@/constants/drawingModes';

interface UseLiveDistanceTooltipProps {
  isActive: boolean;
  measurementData: MeasurementData | null;
  unit?: 'px' | 'm' | 'cm' | 'mm';
}

export const useLiveDistanceTooltip = ({
  isActive,
  measurementData,
  unit = 'm'
}: UseLiveDistanceTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!isActive || !measurementData) {
      setVisible(false);
      return;
    }

    setVisible(true);
    setPosition(measurementData.midPoint);

    // Calculate display text based on unit
    let distanceText = '';
    const distance = measurementData.distance;
    
    switch (unit) {
      case 'px':
        distanceText = `${Math.round(distance)} px`;
        break;
      case 'm':
        const meters = distance / GRID_CONSTANTS.PIXELS_PER_METER;
        distanceText = `${meters.toFixed(2)} m`;
        break;
      case 'cm':
        const cm = (distance / GRID_CONSTANTS.PIXELS_PER_METER) * 100;
        distanceText = `${cm.toFixed(1)} cm`;
        break;
      case 'mm':
        const mm = (distance / GRID_CONSTANTS.PIXELS_PER_METER) * 1000;
        distanceText = `${Math.round(mm)} mm`;
        break;
      default:
        distanceText = `${Math.round(distance)} px`;
    }

    setDisplayText(distanceText);
  }, [isActive, measurementData, unit]);

  return {
    visible,
    position,
    displayText
  };
};
