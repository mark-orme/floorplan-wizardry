
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';
import { useLayerVisibility } from './useLayerVisibility';
import { useLayerLocking } from './useLayerLocking';
import { useLayerOperations } from './useLayerOperations';
import { UnifiedCanvas, asUnifiedCanvas, bridgeCanvasTypes } from '@/types/canvas-unified';
import { ExtendedCanvas } from '@/types/canvas/ExtendedCanvas';

interface UseLayerActionsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | UnifiedCanvas | null>; // Updated to accept UnifiedCanvas
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
  // Cast to the basic Canvas type for compatibility with the hooks
  const fabricCanvasCompatRef = fabricCanvasRef as React.MutableRefObject<FabricCanvas | null>;

  // Use properly typed hook dependencies
  const { toggleLayerVisibility } = useLayerVisibility({ 
    fabricCanvasRef: fabricCanvasCompatRef, 
    setLayers 
  });
  
  const { toggleLayerLock } = useLayerLocking({ 
    fabricCanvasRef: fabricCanvasCompatRef, 
    setLayers 
  });
  
  const { createNewLayer, deleteLayer } = useLayerOperations({
    fabricCanvasRef: fabricCanvasCompatRef,
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
