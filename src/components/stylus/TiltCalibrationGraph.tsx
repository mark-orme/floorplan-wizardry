
import React, { useRef } from 'react';
import {
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Line
} from 'recharts';

interface TiltCalibrationGraphProps {
  tiltPoints: Array<{tilt: number, effect: number}>;
  onPointsUpdated: (points: Array<{tilt: number, effect: number}>) => void;
}

const smoothTiltCurve = (points: Array<{tilt: number, effect: number}>) => {
  if (points.length <= 2) return points;
  
  const windowSize = 3;
  return points.map((point, i, arr) => {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(arr.length - 1, i + Math.floor(windowSize / 2));
    const window = arr.slice(start, end + 1);
    
    const avgEffect = window.reduce((sum, p) => sum + p.effect, 0) / window.length;
    
    return {
      tilt: point.tilt,
      effect: avgEffect
    };
  });
};

export const TiltCalibrationGraph: React.FC<TiltCalibrationGraphProps> = ({
  tiltPoints,
  onPointsUpdated
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const smoothedPoints = smoothTiltCurve(tiltPoints);

  return (
    <div ref={chartRef} className="w-full h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={smoothedPoints}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="tilt" 
            label={{ value: 'Tilt Angle (degrees)', position: 'bottom' }}
          />
          <YAxis 
            label={{ value: 'Effect Strength', angle: -90, position: 'left' }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="effect"
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
