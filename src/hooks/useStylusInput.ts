
import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { BrushEffects } from '@/utils/canvas/brushes/AdvancedBrushEffects';
import { toast } from 'sonner';

interface UseStylusInputProps {
  fabricCanvas: FabricCanvas | null;
  baseWidth: number;
  baseColor: string;
}

export const useStylusInput = ({ 
  fabricCanvas, 
  baseWidth, 
  baseColor 
}: UseStylusInputProps) => {
  const lastPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isEraserRef = useRef(false);

  const handleStylusInput = useCallback((e: PointerEvent) => {
    if (!fabricCanvas?.isDrawingMode) return;

    // Calculate velocity if we have a previous point
    let velocity = 0;
    const now = performance.now();
    if (lastPointRef.current) {
      const dx = e.clientX - lastPointRef.current.x;
      const dy = e.clientY - lastPointRef.current.y;
      const dt = now - lastPointRef.current.time;
      velocity = Math.sqrt(dx * dx + dy * dy) / dt;
    }

    // Update brush parameters based on stylus input
    const params = {
      pressure: e.pressure || 0.5,
      tiltX: e.tiltX || 0,
      tiltY: e.tiltY || 0,
      velocity,
      baseWidth,
      baseColor
    };

    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = BrushEffects.calculateBrushWidth(params);
      fabricCanvas.freeDrawingBrush.color = BrushEffects.calculateBrushColor(params);
      // Set opacity through shadow
      const opacity = BrushEffects.calculateBrushOpacity(params);
      fabricCanvas.freeDrawingBrush.shadow = new fabric.Shadow({
        color: baseColor,
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        opacity
      });
    }

    // Store current point for velocity calculation
    lastPointRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: now
    };
  }, [fabricCanvas, baseWidth, baseColor]);

  // Handle eraser detection
  const handleStylusDown = useCallback((e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      isEraserRef.current = e.buttons === 32;
      if (isEraserRef.current) {
        // Store current brush settings and switch to eraser
        if (fabricCanvas?.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.color = '#ffffff';
          fabricCanvas.freeDrawingBrush.width = baseWidth * 2;
        }
      }
    }
  }, [fabricCanvas, baseWidth]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const canvas = fabricCanvas.upperCanvasEl;
    if (!canvas) return;

    // Check if device supports advanced stylus features
    if (window.PointerEvent) {
      const hasAdvancedFeatures = 'tiltX' in new PointerEvent('pointerdown');
      if (hasAdvancedFeatures) {
        toast.success("Advanced stylus features detected!");
      }
    }

    canvas.addEventListener('pointermove', handleStylusInput);
    canvas.addEventListener('pointerdown', handleStylusDown);

    return () => {
      canvas.removeEventListener('pointermove', handleStylusInput);
      canvas.removeEventListener('pointerdown', handleStylusDown);
    };
  }, [fabricCanvas, handleStylusInput, handleStylusDown]);
};
