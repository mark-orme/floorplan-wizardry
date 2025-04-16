
import React from 'react';
import { Card } from '@/components/ui/card';

interface AreaCalculationDisplayProps {
  areaM2: number;
}

export const AreaCalculationDisplay: React.FC<AreaCalculationDisplayProps> = ({
  areaM2
}) => {
  if (areaM2 <= 0) return null;
  
  const areaSqFt = areaM2 * 10.764; // Conversion factor for m² to sq ft
  
  return (
    <Card className="absolute top-16 right-4 p-3 z-10 flex flex-col gap-1 bg-white/90 border-green-200">
      <div className="text-xs font-medium text-muted-foreground">Gross Internal Area</div>
      <div className="font-semibold">{areaM2.toFixed(2)} m²</div>
      <div className="text-sm text-muted-foreground">{areaSqFt.toFixed(2)} sq ft</div>
    </Card>
  );
};
