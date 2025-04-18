
import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { createGrid } from '@/utils/gridCreator';
import { useIsMobile } from '@/hooks/use-mobile';

interface ConnectedDrawingCanvasProps {
  width: number;
  height: number;
  showGrid?: boolean;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width,
  height,
  showGrid = false,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const isMobile = useIsMobile();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    console.info('Initializing canvas');
    
    try {
      // Create canvas instance with mobile-optimized settings
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true, // Ensure immediate rendering
        stopContextMenu: true // Prevent context menu on mobile
      });
      
      fabricCanvasRef.current = canvas;
      
      // Add mobile-specific classes
      if (isMobile && canvas.wrapperEl) {
        canvas.wrapperEl.classList.add('mobile-canvas-wrapper');
        canvas.wrapperEl.classList.add('touch-optimized-canvas');
      }
      
      // Create grid if needed
      if (showGrid) {
        console.info('Creating grid for initialized canvas');
        try {
          // Clear any existing grid first
          const existingGridObjects = canvas.getObjects().filter(obj => 
            (obj as any).isGrid === true || (obj as any).objectType === 'grid'
          );
          
          if (existingGridObjects.length > 0) {
            console.info(`Removing ${existingGridObjects.length} existing grid objects`);
            existingGridObjects.forEach(obj => canvas.remove(obj));
          }
          
          // Create new grid with mobile-optimized settings
          const gridSize = isMobile ? 30 : 20; // Larger grid on mobile for better visibility
          const gridObjects = createGrid(canvas, width, height, gridSize);
          
          // Force grid to front on mobile for better visibility
          if (isMobile) {
            gridObjects.forEach(obj => {
              obj.set({
                stroke: 'rgba(180, 180, 180, 0.8)', // More visible on mobile
                strokeWidth: 1.5, // Slightly thicker on mobile
                evented: false
              });
            });
          }
          
          canvas.renderAll();
          console.info(`Grid created with ${gridObjects.length} objects`);
        } catch (error) {
          console.error('Error creating grid:', error);
        }
      }
      
      // Notify parent component
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
    } catch (error) {
      console.error('Failed to initialize canvas', error);
    }
    
    // Cleanup function
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [width, height, showGrid, onCanvasReady, isMobile]);

  return <canvas ref={canvasRef} className={isMobile ? 'mobile-optimized-canvas' : ''} />;
};
