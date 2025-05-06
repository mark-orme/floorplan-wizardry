import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StylusCurveVisualizerProps {
  curve: number[];
  onChange: (curve: number[]) => void;
  className?: string;
  height?: number;
  width?: number;
  editable?: boolean;
}

export function StylusCurveVisualizer({
  curve,
  onChange,
  className,
  height = 200,
  width = 400,
  editable = true
}: StylusCurveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Draw the curve on the canvas
  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current?.getContext('2d');
      if (!context || !canvasRef.current) return;
      
      // Now context is guaranteed not to be undefined
      drawCurve(context);
    }
  }, [curve, activePointIndex, height, width]);
  
  const drawCurve = (context: CanvasRenderingContext2D) => {
    // context is guaranteed not to be undefined
    
    // Clear canvas
    if (canvasRef.current && context) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    // Set up styles
    context.lineWidth = 2;
    context.strokeStyle = '#3b82f6'; // blue-500
    
    // Draw curve
    context.beginPath();
    
    // Map curve points to canvas coordinates
    const pointCount = curve.length;
    const step = width / (pointCount - 1);
    
    for (let i = 0; i < pointCount; i++) {
      const x = i * step;
      const y = height - (curve[i] * height); // Invert Y axis
      
      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
      
      // Draw control points
      context.fillStyle = i === activePointIndex ? '#ef4444' : '#3b82f6';
      context.beginPath();
      context.arc(x, y, 6, 0, Math.PI * 2);
      context.fill();
    }
    
    // Draw the curve
    context.stroke();
    
    // Draw grid lines
    context.strokeStyle = '#e5e7eb'; // gray-200
    context.lineWidth = 1;
    
    // Horizontal grid lines (every 0.25)
    for (let i = 0; i <= 4; i++) {
      const y = height * (i / 4);
      
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
      
      // Add labels
      context.fillStyle = '#6b7280'; // gray-500
      context.font = '12px sans-serif';
      context.textAlign = 'left';
      context.fillText(`${1 - i / 4}`, 5, y - 5);
    }
    
    // Vertical grid lines (every 0.25)
    for (let i = 0; i <= 4; i++) {
      const x = width * (i / 4);
      
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
      
      // Add labels
      context.fillStyle = '#6b7280'; // gray-500
      context.font = '12px sans-serif';
      context.textAlign = 'center';
      context.fillText(`${i / 4}`, x, height - 5);
    }
  };
  
  // Handle mouse interactions for curve editing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editable || !canvasRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const pointCount = curve.length;
    const step = width / (pointCount - 1);
    
    // Find the closest point
    let minDistance = Infinity;
    let closestPointIndex = -1;
    
    for (let i = 0; i < pointCount; i++) {
      const pointX = i * step;
      const pointY = height - (curve[i] * height);
      
      const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
      
      if (distance < minDistance) {
        minDistance = distance;
        closestPointIndex = i;
      }
    }
    
    // If we found a close enough point, select it
    if (minDistance < 20) {
      setActivePointIndex(closestPointIndex);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (activePointIndex === null || !editable || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Calculate new Y value (normalized 0-1)
    const normalizedY = Math.max(0, Math.min(1, 1 - (y / height)));
    
    // Don't allow moving first or last point horizontally
    if (activePointIndex === 0) {
      // First point must stay at 0
      const newCurve = [...curve];
      newCurve[activePointIndex] = normalizedY;
      onChange(newCurve);
    } else if (activePointIndex === curve.length - 1) {
      // Last point must stay at 1
      const newCurve = [...curve];
      newCurve[activePointIndex] = normalizedY;
      onChange(newCurve);
    } else {
      // Middle points can be adjusted
      const newCurve = [...curve];
      newCurve[activePointIndex] = normalizedY;
      onChange(newCurve);
    }
  };
  
  const handleMouseUp = () => {
    setActivePointIndex(null);
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn('relative border rounded-md bg-white', className)}
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="block"
      />
      {!editable && (
        <div className="absolute inset-0 bg-transparent cursor-not-allowed" />
      )}
    </div>
  );
}
