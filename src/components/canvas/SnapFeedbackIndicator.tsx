
import React, { useEffect, useState } from 'react';
import { Point } from '@/types/core/Point';

interface SnapFeedbackIndicatorProps {
  point: Point;
  visible: boolean;
  type?: 'grid' | 'angle' | 'both' | 'object';
  size?: number;
  duration?: number;
}

/**
 * Visual feedback indicator for when a point is snapped to grid or angle
 */
export const SnapFeedbackIndicator: React.FC<SnapFeedbackIndicatorProps> = ({
  point,
  visible,
  type = 'grid',
  size = 10,
  duration = 2000
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  useEffect(() => {
    setIsVisible(visible);
    
    if (visible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [visible, duration, point]);
  
  if (!isVisible) return null;
  
  // Colors for different snap types
  const colors = {
    grid: '#3b82f6', // Blue
    angle: '#f97316', // Orange
    both: '#8b5cf6',  // Purple
    object: '#10b981'  // Green
  };
  
  const color = colors[type] || colors.grid;
  
  return (
    <div 
      className="absolute pointer-events-none z-50"
      style={{
        left: point.x - size/2,
        top: point.y - size/2,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 0 2px white, 0 0 ${size/2}px ${color}`,
        animation: 'snapPulse 1s ease-out infinite',
      }}
    />
  );
};

/**
 * CSS for the snap indicator animation
 */
export const SnapFeedbackStyle = () => (
  <style>
    {`
    @keyframes snapPulse {
      0% {
        transform: scale(0.8);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.5;
      }
      100% {
        transform: scale(0.8);
        opacity: 0.8;
      }
    }
  `}
  </style>
);
