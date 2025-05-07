import React, { useRef, useEffect, useState } from 'react';

interface StylusCurveVisualizerProps {
  pressureCurve: number[];
  width?: number;
  height?: number;
  lineColor?: string;
  backgroundColor?: string;
  title?: string;
}

export const StylusCurveVisualizer: React.FC<StylusCurveVisualizerProps> = ({
  pressureCurve,
  width = 300,
  height = 200,
  lineColor = '#3b82f6',
  backgroundColor = '#f8fafc',
  title = 'Pressure Curve'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw the pressure curve
    if (pressureCurve && pressureCurve.length > 0) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const normalizedCurve = pressureCurve.map(p => Math.max(0, Math.min(1, p)));
      
      for (let i = 0; i < normalizedCurve.length; i++) {
        const x = (i / Math.max(1, normalizedCurve.length - 1)) * canvas.width;
        // Invert Y to make higher values go up
        const y = canvas.height - (normalizedCurve[i] || 0) * canvas.height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Draw control points
      ctx.fillStyle = '#ef4444';
      for (let i = 0; i < normalizedCurve.length; i++) {
        const x = (i / Math.max(1, normalizedCurve.length - 1)) * canvas.width;
        const y = canvas.height - (normalizedCurve[i] || 0) * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add title
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 20);
    
  }, [pressureCurve, width, height, lineColor, backgroundColor, title]);
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="border border-gray-200 rounded shadow-sm"
      />
    </div>
  );
};
