
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';
import { useLayerVisibility } from './useLayerVisibility';
import { useLayerLocking } from './useLayerLocking';
import { useLayerOperations } from './useLayerOperations';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { ExtendedCanvas } from '@/types/fabric-unified';

interface UseLayerActionsProps {
  fabricCanvasRef: React.MutableRefObject<ExtendedFabricCanvas | null>;
  layers: DrawingLayer[];
  setLayers: React.Dispatch<React.SetStateAction<DrawingLayer[]>>;
  activeLayerId: string;
  setActiveLayerId: React.Dispatch<React.SetStateAction<string>>;
}

export const useLayerActions = ({
  fabricCanvasRef,
  layers,
  setLayers,
  activeLayerId,
  setActiveLayerId
}: UseLayerActionsProps) => {
  // Create a wrapper reference that properly handles the type conversion
  const extendedCanvasRef = {
    get current() {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        // Ensure viewportTransform is defined when needed
        if (canvas.viewportTransform === undefined) {
          canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        }
        // Ensure renderOnAddRemove has a default value
        if (canvas.renderOnAddRemove === undefined) {
          canvas.renderOnAddRemove = true;
        }
      }
      return canvas as unknown as ExtendedCanvas;
    }
  };
  
  // Use the properly typed refs for each hook
  const { toggleLayerVisibility } = useLayerVisibility({ 
    fabricCanvasRef: fabricCanvasRef as unknown as React.MutableRefObject<FabricCanvas | null>, 
    setLayers 
  });
  
  const { toggleLayerLock } = useLayerLocking({ 
    fabricCanvasRef: fabricCanvasRef as unknown as React.MutableRefObject<FabricCanvas | null>, 
    setLayers 
  });
  
  const { createNewLayer, deleteLayer } = useLayerOperations({
    fabricCanvasRef: extendedCanvasRef,
    layers,
    setLayers,
    activeLayerId,
    setActiveLayerId
  });
  
  const setActiveLayer = useCallback((layerId: string) => {
    setActiveLayerId(layerId);
  }, [setActiveLayerId]);

  return {
    toggleLayerVisibility,
    toggleLayerLock,
    setActiveLayer,
    createNewLayer,
    deleteLayer
  };
};
