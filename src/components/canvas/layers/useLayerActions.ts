
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';

interface UseLayerActionsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
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
  const toggleLayerVisibility = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setLayers(prevLayers => {
      const updatedLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          const newVisibility = !layer.visible;
          
          layer.objects.forEach(obj => {
            obj.set('visible', newVisibility);
          });
          
          return {
            ...layer,
            visible: newVisibility
          };
        }
        return layer;
      });
      
      canvas.requestRenderAll();
      return updatedLayers;
    });
  }, [fabricCanvasRef, setLayers]);
  
  const toggleLayerLock = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setLayers(prevLayers => {
      const updatedLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          const newLockState = !layer.locked;
          
          layer.objects.forEach(obj => {
            obj.set('selectable', !newLockState);
            obj.set('evented', !newLockState);
          });
          
          return {
            ...layer,
            locked: newLockState
          };
        }
        return layer;
      });
      
      canvas.requestRenderAll();
      return updatedLayers;
    });
  }, [fabricCanvasRef, setLayers]);
  
  const setActiveLayer = useCallback((layerId: string) => {
    setActiveLayerId(layerId);
  }, [setActiveLayerId]);
  
  const createNewLayer = useCallback(() => {
    const newLayerId = `layer-${Date.now()}`;
    const newLayerName = `Layer ${layers.length + 1}`;
    
    setLayers(prevLayers => [
      ...prevLayers,
      {
        id: newLayerId,
        name: newLayerName,
        visible: true,
        locked: false,
        objects: []
      }
    ]);
    
    setActiveLayerId(newLayerId);
  }, [layers.length, setLayers, setActiveLayerId]);
  
  const deleteLayer = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const layerToDelete = layers.find(layer => layer.id === layerId);
    if (!layerToDelete) return;
    
    layerToDelete.objects.forEach(obj => {
      canvas.remove(obj);
    });
    
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    
    if (activeLayerId === layerId) {
      const remainingLayers = layers.filter(layer => layer.id !== layerId);
      if (remainingLayers.length > 0) {
        setActiveLayerId(remainingLayers[0].id);
      }
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, layers, activeLayerId, setLayers, setActiveLayerId]);

  return {
    toggleLayerVisibility,
    toggleLayerLock,
    setActiveLayer,
    createNewLayer,
    deleteLayer
  };
};
