
import React from 'react';

interface SnapIndicatorProps {
  x: number;
  y: number;
  size?: number;
  color?: string;
  duration?: number;
}

/**
 * Snap Indicator component
 * Visual indicator showing snap points on the canvas
 */
export const SnapIndicator: React.FC<SnapIndicatorProps> = ({
  x,
  y,
  size = 8,
  color = '#3b82f6', // Default blue color
  duration = 800
}) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        boxShadow: `0 0 0 2px white, 0 0 0 3px ${color}`,
        opacity: 0.8,
        animation: `snapPulse ${duration}ms ease-out forwards`
      }}
    />
  );
};

// Create a component with the keyframes definition for the animation
export const SnapIndicatorStyle = () => (
  <style jsx global>{`
    @keyframes snapPulse {
      0% {
        transform: scale(0.5);
        opacity: 1;
      }
      70% {
        transform: scale(1.2);
        opacity: 0.7;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
  `}</style>
);
