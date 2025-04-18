
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsIOS } from '@/hooks/use-ios';
import { createBasicEmergencyGrid, setupGridVisibilityCheck } from '@/utils/gridCreationUtils';
import { enhanceGridForIOS } from '@/utils/grid/gridVisibilityManager';

interface MobileGridLayerProps {
  canvas: FabricCanvas | null;
  visible?: boolean;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

/**
 * Specialized grid layer component optimized for mobile devices
 * Uses simpler grid pattern and more frequent visibility checks
 */
export const MobileGridLayer: React.FC<MobileGridLayerProps> = ({ 
  canvas, 
  visible = true,
  onGridCreated 
}) => {
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();
  const initialized = useRef(false);
  
  useEffect(() => {
    if (!canvas || !isMobile || initialized.current) return;
    
    // Create initial grid
    console.log("MobileGridLayer: Creating mobile-optimized grid");
    const gridObjects = createBasicEmergencyGrid(canvas);
    initialized.current = true;
    
    if (onGridCreated) {
      onGridCreated(gridObjects);
    }
    
    // Apply iOS-specific enhancements
    if (isIOS) {
      enhanceGridForIOS(canvas);
    }
    
    // Set up more frequent visibility checks for mobile
    const cleanupCheck = setupGridVisibilityCheck(canvas, 3000);
    
    // Force additional renders to ensure grid visibility on iOS
    const renderInterval = setInterval(() => {
      if (canvas) {
        canvas.requestRenderAll();
      }
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      cleanupCheck();
      clearInterval(renderInterval);
      
      // Remove grid objects if they exist
      if (canvas) {
        gridObjects.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        canvas.requestRenderAll();
      }
    };
  }, [canvas, isMobile, isIOS, onGridCreated]);
  
  // Update grid visibility when it changes
  useEffect(() => {
    if (!canvas) return;
    
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    
    gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });
    
    canvas.requestRenderAll();
  }, [canvas, visible]);
  
  // This is a controller component, no visible elements
  return null;
};

export default MobileGridLayer;
