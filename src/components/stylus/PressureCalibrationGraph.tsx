
import React, { useRef, useEffect } from 'react';
import { Line } from 'recharts';
import { LineChart } from '@/components/ui/chart';

interface PressureCalibrationGraphProps {
  pressurePoints: Array<{pressure: number, thickness: number}>;
  onPointsUpdated: (points: Array<{pressure: number, thickness: number}>) => void;
}

export const PressureCalibrationGraph: React.FC<PressureCalibrationGraphProps> = ({
  pressurePoints,
  onPointsUpdated
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={chartRef} className="w-full h-48 mt-4">
      <LineChart 
        data={pressurePoints}
        index="pressure"
        categories={["thickness"]}
        className="h-full"
      >
        <Line 
          className="stroke-blue-500 stroke-2"
          marker={{ size: 6 }}
        />
      </LineChart>
    </div>
  );
};
