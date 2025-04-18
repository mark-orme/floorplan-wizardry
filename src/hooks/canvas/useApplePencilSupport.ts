
import { useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';

interface ApplePencilSupport {
  isApplePencil: boolean;
  adjustedLineThickness: number;
  processPencilTouchEvent: (e: TouchEvent) => { isApplePencil: boolean; pressure: number };
  snapPencilPointToGrid: (point: Point) => Point;
}

export const useApplePencilSupport = ({
  canvas,
  lineThickness = 2
}: {
  canvas: FabricCanvas | null;
  lineThickness: number;
}): ApplePencilSupport => {
  const isApplePencilRef = useRef(false);
  const lastPressureRef = useRef(0);
  
  // Process touch event to detect Apple Pencil
  const processPencilTouchEvent = useCallback((e: TouchEvent): { isApplePencil: boolean; pressure: number } => {
    if (!e.touches || e.touches.length === 0) {
      return { isApplePencil: false, pressure: 0 };
    }
    
    const touch = e.touches[0];
    // @ts-ignore - radiusX is available in some browsers for Apple Pencil
    const radiusX = touch.radiusX || touch.webkitRadiusX || touch.mozRadiusX || 0;
    // @ts-ignore - force is available in some browsers for Apple Pencil
    const pressure = touch.force || touch.webkitForce || 0;
    
    // Apple Pencil typically has low radius and some pressure value
    const isPencil = 
      (radiusX < 10 && pressure > 0) || 
      // @ts-ignore - Apple Pencil identifier (iOS 9.1+)
      (touch.touchType === 'stylus');
    
    isApplePencilRef.current = isPencil;
    lastPressureRef.current = pressure;
    
    return { isApplePencil: isPencil, pressure };
  }, []);
  
  // Calculate adjusted line thickness based on pencil pressure
  const getAdjustedLineThickness = useCallback(() => {
    if (!isApplePencilRef.current) return lineThickness;
    
    const pressure = lastPressureRef.current;
    if (pressure <= 0) return lineThickness;
    
    // Scale thickness based on pressure (1.0 is "normal" pressure)
    return lineThickness * (0.5 + pressure * 1.5);
  }, [lineThickness]);
  
  // Snap pencil point to grid for more precise drawing
  const snapPencilPointToGrid = useCallback((point: Point): Point => {
    if (!canvas) return point;
    
    // For now, just return the original point
    // In a real implementation, you would snap to nearest grid point if needed
    return point;
  }, [canvas]);
  
  return {
    isApplePencil: isApplePencilRef.current,
    adjustedLineThickness: getAdjustedLineThickness(),
    processPencilTouchEvent,
    snapPencilPointToGrid
  };
};
