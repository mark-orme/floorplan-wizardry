
import { useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';

interface UseCanvasObservabilityProps {
  canvas: FabricCanvas | null;
  componentName?: string;
}

/**
 * Hook that adds observability to canvas operations
 * Captures canvas events and sends them to monitoring systems
 */
export const useCanvasObservability = ({
  canvas,
  componentName = 'Canvas'
}: UseCanvasObservabilityProps) => {
  // Track object additions
  const trackObjectAdded = useCallback((e: any) => {
    const timestamp = Date.now();
    const objectCount = canvas?.getObjects().length || 0;
    
    captureMessage("Canvas object added", {
      level: 'info',
      tags: { component: componentName },
      extra: {
        objectCount,
        timestamp,
        action: 'object-added'
      }
    });
  }, [canvas, componentName]);
  
  // Track object removals
  const trackObjectRemoved = useCallback((e: any) => {
    const timestamp = Date.now();
    const objectCount = canvas?.getObjects().length || 0;
    
    captureMessage("Canvas object removed", {
      level: 'info',
      tags: { component: componentName },
      extra: {
        objectCount,
        timestamp,
        action: 'object-removed'
      }
    });
  }, [canvas, componentName]);
  
  // Track object modifications
  const trackObjectModified = useCallback((e: any) => {
    const timestamp = Date.now();
    const objectCount = canvas?.getObjects().length || 0;
    
    captureMessage("Canvas object modified", {
      level: 'info',
      tags: { component: componentName },
      extra: {
        objectCount,
        timestamp,
        action: 'object-modified'
      }
    });
  }, [canvas, componentName]);
  
  // Track canvas rendering
  const trackRendered = useCallback(() => {
    const timestamp = Date.now();
    
    captureMessage("Canvas rendered", {
      level: 'info',
      tags: { component: componentName },
      extra: {
        action: 'canvas-rendered',
        timestamp
      }
    });
  }, [componentName]);
  
  // Track canvas cleared
  const trackCleared = useCallback(() => {
    const timestamp = Date.now();
    
    captureMessage("Canvas cleared", {
      level: 'info',
      tags: { component: componentName },
      extra: {
        action: 'canvas-cleared',
        timestamp
      }
    });
  }, [componentName]);
  
  // Track canvas zoom
  const trackZoomed = useCallback(() => {
    const timestamp = Date.now();
    
    captureMessage("Canvas zoomed", {
      level: 'info',
      tags: { component: componentName },
      extra: {
        action: 'canvas-zoomed',
        timestamp
      }
    });
  }, [componentName]);
  
  // Attach event listeners
  useEffect(() => {
    if (!canvas) return;
    
    canvas.on('object:added', trackObjectAdded);
    canvas.on('object:removed', trackObjectRemoved);
    canvas.on('object:modified', trackObjectModified);
    canvas.on('after:render', trackRendered);
    
    return () => {
      canvas.off('object:added', trackObjectAdded);
      canvas.off('object:removed', trackObjectRemoved);
      canvas.off('object:modified', trackObjectModified);
      canvas.off('after:render', trackRendered);
    };
  }, [canvas, trackObjectAdded, trackObjectModified, trackObjectRemoved, trackRendered]);
  
  return {
    trackObjectAdded,
    trackObjectRemoved,
    trackObjectModified,
    trackRendered,
    trackCleared,
    trackZoomed
  };
};
