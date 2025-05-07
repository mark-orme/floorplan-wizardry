
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';
import { useLayerVisibility } from './useLayerVisibility';
import { useLayerLocking } from './useLayerLocking';
import { useLayerOperations } from './useLayerOperations';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { asExtendedCanvas } from '@/types/canvas-types';

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
  // Create a reference that properly casts the canvas for the hooks that expect FabricCanvas
  const canvasRef = {
    get current() {
      return fabricCanvasRef.current ? asExtendedCanvas(fabricCanvasRef.current) : null;
    }
  } as React.MutableRefObject<FabricCanvas | null>;
  
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
