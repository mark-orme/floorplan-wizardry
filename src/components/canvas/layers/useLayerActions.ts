
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
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
  // Create a reference that casts the canvas properly
  // We'll make sure the viewportTransform is properly typed
  const canvasRef = {
    get current() {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        // Ensure viewportTransform is defined when needed
        if (canvas.viewportTransform === undefined) {
          canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        }
      }
      return canvas;
    }
  };
  
  const { toggleLayerVisibility } = useLayerVisibility({ fabricCanvasRef: canvasRef, setLayers });
  const { toggleLayerLock } = useLayerLocking({ fabricCanvasRef: canvasRef, setLayers });
  const { createNewLayer, deleteLayer } = useLayerOperations({
    fabricCanvasRef: canvasRef,
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
