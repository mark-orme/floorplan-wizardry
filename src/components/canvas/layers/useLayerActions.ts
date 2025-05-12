
import { useCallback } from 'react';
import { Object as FabricObject } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';
import { useLayerVisibility } from './useLayerVisibility';
import { useLayerLocking } from './useLayerLocking';
import { useLayerOperations } from './useLayerOperations';
import { UnifiedCanvas } from '@/types/unified-canvas';

interface UseLayerActionsProps {
  fabricCanvasRef: React.MutableRefObject<UnifiedCanvas | null>;
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
  // Use the unified canvas reference that's compatible with all our components
  
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
