
import React from 'react';
import { formatArea } from '@/utils/calculations/internalAreaCalculator';

interface AreaCalculationDisplayProps {
  areaM2: number;
}

export const AreaCalculationDisplay: React.FC<AreaCalculationDisplayProps> = ({ areaM2 }) => {
  if (areaM2 <= 0) return null;
  
  return (
    <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded shadow-md z-10">
      <h3 className="text-sm font-medium">Gross Internal Area</h3>
      <p className="text-sm">{formatArea(areaM2)}</p>
    </div>
  );
};
