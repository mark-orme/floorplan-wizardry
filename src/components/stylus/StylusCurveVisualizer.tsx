
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import * as fabric from 'fabric';

interface StylusCurveVisualizerProps {
  canvas: Canvas | null;
  color: string;
  strokeWidth: number;
  strokeStyle?: 'solid' | 'dashed';
}

export const StylusCurveVisualizer: React.FC<StylusCurveVisualizerProps> = ({
  canvas,
  color = '#000000',
  strokeWidth = 1,
  strokeStyle = 'solid'
}) => {
  const points = useRef<Array<{ x: number; y: number }>>([]);
  const currentPath = useRef<fabric.Object | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pressure, setPressure] = useState(1);
  
  // Clean up function to remove events and objects
  const cleanUp = () => {
    if (!canvas) return;
    
    if (currentPath.current && canvas.contains(currentPath.current)) {
      canvas.remove(currentPath.current);
    }
    
    currentPath.current = null;
    points.current = [];
    setIsDrawing(false);
  };

  useEffect(() => {
    if (!canvas) return;
    
    const handlePointerDown = (e: any) => {
      // Make sure we're using a stylus
      if (e.pointerType !== 'pen') return;
      
      cleanUp();
      setIsDrawing(true);
      
      const pointer = canvas.getPointer(e.e);
      points.current = [pointer];
      
      // Create a new path
      try {
        // Create an empty path to avoid issues
        const pathObj = new fabric.Path('M 0 0', {
          stroke: color,
          strokeWidth: strokeWidth * (e.pressure || 1),
          fill: 'transparent',
          strokeLineCap: 'round',
          strokeLineJoin: 'round',
          strokeDashArray: strokeStyle === 'dashed' ? [5, 5] : undefined,
        });
        
        currentPath.current = pathObj;
        
        if (canvas) {
          canvas.add(pathObj);
        }
      } catch (err) {
        console.error('Error creating path:', err);
      }
      
      setPressure(e.pressure || 1);
    };
    
    const handlePointerMove = (e: any) => {
      if (!isDrawing || e.pointerType !== 'pen') return;
      
      const pointer = canvas.getPointer(e.e);
      if (pointer) {
        points.current.push(pointer);
      }
      
      if (points.current.length > 2) {
        updateCurvePath(e.pressure || pressure);
      }
      
      setPressure(e.pressure || pressure);
    };
    
    const handlePointerUp = (e: any) => {
      if (!isDrawing || e.pointerType !== 'pen') return;
      
      if (points.current.length > 2) {
        updateCurvePath(e.pressure || pressure);
      }
      
      setIsDrawing(false);
    };
    
    const updateCurvePath = (currentPressure: number) => {
      if (!currentPath.current || !canvas) return;
      
      // Use a smooth curve approach
      let path = '';
      const pts = points.current;
      
      if (pts.length < 2) return;
      
      // Start at the first point
      const firstPoint = pts[0];
      if (firstPoint) {
        path = `M ${firstPoint.x} ${firstPoint.y}`;
      }
      
      // Add bezier curve segments
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i-1];
        const p1 = pts[i];
        if (!p0 || !p1) continue;
        
        path += ` Q ${(p0.x + p1.x) / 2} ${(p0.y + p1.y) / 2}, ${p1.x} ${p1.y}`;
      }
      
      if (path) {
        try {
          if (currentPath.current && 'set' in currentPath.current) {
            currentPath.current.set({ 
              path: path,
              strokeWidth: strokeWidth * currentPressure
            });
          }
          
          canvas.requestRenderAll();
        } catch (err) {
          console.error('Error updating path:', err);
        }
      }
    };

    canvas.on('mouse:down', handlePointerDown);
    canvas.on('mouse:move', handlePointerMove);
    canvas.on('mouse:up', handlePointerUp);
    
    return () => {
      canvas.off('mouse:down', handlePointerDown);
      canvas.off('mouse:move', handlePointerMove);
      canvas.off('mouse:up', handlePointerUp);
      cleanUp();
    };
  }, [canvas, color, strokeWidth, isDrawing, strokeStyle, pressure]);

  return null;
};

