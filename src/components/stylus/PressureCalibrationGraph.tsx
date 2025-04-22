
import React, { useRef, useEffect } from 'react';
import { Line } from 'recharts';
import {
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface PressureCalibrationGraphProps {
  pressurePoints: Array<{pressure: number, thickness: number}>;
  onPointsUpdated: (points: Array<{pressure: number, thickness: number}>) => void;
}

const smoothPoints = (points: Array<{pressure: number, thickness: number}>) => {
  if (points.length <= 2) return points;
  
  const windowSize = 3;
  return points.map((point, i, arr) => {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(arr.length - 1, i + Math.floor(windowSize / 2));
    const window = arr.slice(start, end + 1);
    
    const avgThickness = window.reduce((sum, p) => sum + p.thickness, 0) / window.length;
    
    return {
      pressure: point.pressure,
      thickness: avgThickness
    };
  });
};

export const PressureCalibrationGraph: React.FC<PressureCalibrationGraphProps> = ({
  pressurePoints,
  onPointsUpdated
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const smoothedPoints = smoothPoints(pressurePoints);

  return (
    <div ref={chartRef} className="w-full h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={smoothedPoints}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="pressure" 
            label={{ value: 'Pressure', position: 'bottom' }}
          />
          <YAxis 
            label={{ value: 'Thickness', angle: -90, position: 'left' }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="thickness"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
