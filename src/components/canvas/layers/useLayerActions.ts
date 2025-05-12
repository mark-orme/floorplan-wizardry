
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';
import { useLayerVisibility } from './useLayerVisibility';
import { useLayerLocking } from './useLayerLocking';
import { useLayerOperations } from './useLayerOperations';
import { UnifiedCanvas, asUnifiedCanvas } from '@/types/canvas-unified';

interface UseLayerActionsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | UnifiedCanvas | null>;
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
  // Use the canvas reference directly without type conversions
  // This simplifies our type hierarchy
  
  const { toggleLayerVisibility } = useLayerVisibility({ 
    fabricCanvasRef, 
    setLayers 
  });
  
  const { toggleLayerLock } = useLayerLocking({ 
    fabricCanvasRef, 
    setLayers 
  });
  
  const { createNewLayer, deleteLayer } = useLayerOperations({
    fabricCanvasRef,
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
