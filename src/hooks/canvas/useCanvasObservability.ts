import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { captureMessage } from '@/utils/sentry';

interface UseCanvasObservabilityProps {
  canvas: FabricCanvas | null;
  onInteraction?: (action: string, timestamp: number) => void;
  onStateChange?: (objectCount: number, timestamp: number, action: string) => void;
}

export const useCanvasObservability = ({
  canvas,
  onInteraction,
  onStateChange
}: UseCanvasObservabilityProps) => {
  const objectCountRef = useRef(0);

  useEffect(() => {
    if (!canvas) return;

    const handleObjectAdded = (event: any) => {
      const timestamp = Date.now();
      const objectCount = canvas.getObjects().length;
      objectCountRef.current = objectCount;

      captureMessage("Canvas state change detected", {
        level: 'info',
        tags: { component: "CanvasObservability" },
        extra: { objectCount, timestamp, action: 'objectAdded' }
      });
      
      onStateChange?.(objectCount, timestamp, 'objectAdded');
    };

    const handleObjectRemoved = (event: any) => {
      const timestamp = Date.now();
      const objectCount = canvas.getObjects().length;
      objectCountRef.current = objectCount;

      captureMessage("Canvas state change detected", {
        level: 'info',
        tags: { component: "CanvasObservability" },
        extra: { objectCount, timestamp, action: 'objectRemoved' }
      });

      onStateChange?.(objectCount, timestamp, 'objectRemoved');
    };

    const handleObjectModified = (event: any) => {
      const timestamp = Date.now();
      const objectCount = canvas.getObjects().length;
      objectCountRef.current = objectCount;

      captureMessage("Canvas state change detected", {
        level: 'info',
        tags: { component: "CanvasObservability" },
        extra: { objectCount, timestamp, action: 'objectModified' }
      });

      onStateChange?.(objectCount, timestamp, 'objectModified');
    };

    const handleSelectionCreated = (event: any) => {
      const timestamp = Date.now();
      captureMessage("Canvas interaction metric", {
        level: 'info',
        tags: { component: "CanvasObservability" },
        extra: { action: 'selectionCreated', timestamp }
      });
      
      onInteraction?.('selectionCreated', timestamp);
    };

    const handleSelectionUpdated = (event: any) => {
      const timestamp = Date.now();
      captureMessage("Canvas interaction metric", {
        level: 'info',
        tags: { component: "CanvasObservability" },
        extra: { action: 'selectionUpdated', timestamp }
      });

      onInteraction?.('selectionUpdated', timestamp);
    };

    const handleSelectionCleared = (event: any) => {
      const timestamp = Date.now();
      captureMessage("Canvas interaction metric", {
        level: 'info',
        tags: { component: "CanvasObservability" },
        extra: { action: 'selectionCleared', timestamp }
      });

      onInteraction?.('selectionCleared', timestamp);
    };

    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, onInteraction, onStateChange]);
};
