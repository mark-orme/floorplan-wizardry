import React, { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Layers, Plus } from 'lucide-react';
import { VirtualizedLayerList } from './VirtualizedLayerList';

export interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color?: string;
  type?: 'internal' | 'external' | 'extension' | 'note' | 'measurement';
  objects: FabricObject[];
}

interface DrawingLayersProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  layers: DrawingLayer[];
  setLayers: React.Dispatch<React.SetStateAction<DrawingLayer[]>>;
  activeLayerId: string;
  setActiveLayerId: React.Dispatch<React.SetStateAction<string>>;
}

export const DrawingLayers: React.FC<DrawingLayersProps> = ({
  fabricCanvasRef,
  layers,
  setLayers,
  activeLayerId,
  setActiveLayerId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
  
  const renameLayer = useCallback((layerId: string, newName: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId
          ? { ...layer, name: newName }
          : layer
      )
    );
  }, [setLayers]);
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-md shadow-md p-2 absolute top-4 left-4 z-20">
      <div className="flex items-center justify-between mb-2">
        <button 
          className="flex items-center gap-1 text-sm font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Layers size={16} />
          <span>Layers</span>
          <span className="text-xs text-gray-500 ml-1">({layers.length})</span>
        </button>
        
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={createNewLayer}
          title="Add new layer"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {isOpen && (
        <div className="max-h-[50vh] overflow-hidden">
          <VirtualizedLayerList
            layers={layers}
            activeLayerId={activeLayerId}
            onLayerClick={setActiveLayer}
            onToggleVisibility={toggleLayerVisibility}
            onToggleLock={toggleLayerLock}
            onDeleteLayer={deleteLayer}
            listHeight={Math.min(layers.length * 40, 300)}
          />
        </div>
      )}
    </div>
  );
};
