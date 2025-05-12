
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';
import { useLayerVisibility } from './useLayerVisibility';
import { useLayerLocking } from './useLayerLocking';
import { useLayerOperations } from './useLayerOperations';
import { ExtendedFabricCanvas, ExtendedCanvas } from '@/types/canvas-types';

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
  // Cast for compatibility with both hook signatures
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
    fabricCanvasRef: fabricCanvasRef as React.MutableRefObject<ExtendedCanvas | null>,
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
