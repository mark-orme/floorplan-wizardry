
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { isStylus, applyPressureSensitivity, setupOptimalDrawingExperience } from '@/utils/canvas/canvasHelpers';

interface UseApplePencilSupportProps {
  canvas: FabricCanvas | null;
  lineThickness?: number;
}

interface ApplePencilSupportResult {
  isApplePencil: boolean;
  isPencilDetected: boolean;
  pressure: number;
  adjustedLineThickness: number;
  setupPencilSupport: () => void;
  processPencilEvent: (e: any) => void;
}

export const useApplePencilSupport = ({
  canvas,
  lineThickness = 2
}: UseApplePencilSupportProps): ApplePencilSupportResult => {
  const [isApplePencil, setIsApplePencil] = useState(false);
  const [isPencilDetected, setIsPencilDetected] = useState(false);
  const [pressure, setPressure] = useState(1);
  const [adjustedThickness, setAdjustedThickness] = useState(lineThickness);
  
  // Set up pencil support
  const setupPencilSupport = useCallback(() => {
    if (!canvas) return;
    
    // Configure canvas for optimal drawing
    setupOptimalDrawingExperience(canvas);
    
    // Store original line thickness
    (canvas as any)._originalLineThickness = lineThickness;
    
    // Check if device potentially supports Apple Pencil
    const potentiallySupportsApplePencil = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) && 
      (navigator as any).maxTouchPoints > 1;
    
    setIsPencilDetected(potentiallySupportsApplePencil);
    
    console.log('Apple Pencil support initialized:', potentiallySupportsApplePencil);
  }, [canvas, lineThickness]);
  
  // Process pencil events
  const processPencilEvent = useCallback((e: any) => {
    if (!canvas) return;
    
    // Detect if this is a stylus/pencil event
    const pencilEvent = isStylus(e);
    setIsApplePencil(pencilEvent);
    
    if (pencilEvent) {
      // Apply pressure sensitivity
      let currentPressure = 1;
      
      // Extract pressure data
      if ('pressure' in e && e.pressure !== undefined) {
        currentPressure = e.pressure;
      } else if ('force' in e && e.force !== undefined) {
        currentPressure = e.force;
      }
      
      // Ensure pressure is at least 0.5 for visibility
      currentPressure = Math.max(currentPressure, 0.5);
      setPressure(currentPressure);
      
      // Calculate adjusted thickness
      const newThickness = lineThickness * currentPressure;
      setAdjustedThickness(newThickness);
      
      // Apply to canvas if in drawing mode
      if (canvas.isDrawingMode) {
        applyPressureSensitivity(canvas, e);
      }
    } else {
      // Reset to default pressure for non-pencil input
      setPressure(1);
      setAdjustedThickness(lineThickness);
    }
  }, [canvas, lineThickness]);
  
  // Set up event handlers
  useEffect(() => {
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    
    // Initialize
    setupPencilSupport();
    
    // Add event listeners for pointer events
    const handlePointerDown = (e: PointerEvent) => {
      processPencilEvent(e);
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (e.buttons > 0) { // Only process when buttons are pressed
        processPencilEvent(e);
      }
    };
    
    // Add event listeners
    canvasElement.addEventListener('pointerdown', handlePointerDown);
    canvasElement.addEventListener('pointermove', handlePointerMove);
    
    // iOS-specific handling for touch events (fallback)
    canvasElement.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        processPencilEvent(e.touches[0]);
      }
    });
    
    return () => {
      // Remove event listeners
      canvasElement.removeEventListener('pointerdown', handlePointerDown);
      canvasElement.removeEventListener('pointermove', handlePointerMove);
      canvasElement.removeEventListener('touchstart', processPencilEvent as any);
    };
  }, [canvas, processPencilEvent, setupPencilSupport]);
  
  return {
    isApplePencil,
    isPencilDetected,
    pressure,
    adjustedLineThickness: adjustedThickness,
    setupPencilSupport,
    processPencilEvent
  };
};
