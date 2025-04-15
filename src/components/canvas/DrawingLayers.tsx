
import React, { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Layers, Eye, EyeOff, Plus, PenTool, Trash2, Lock, Unlock } from 'lucide-react';

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
  
  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setLayers(prevLayers => {
      const updatedLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          // Update visibility state
          const newVisibility = !layer.visible;
          
          // Update fabric objects visibility
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
  
  // Toggle layer lock
  const toggleLayerLock = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setLayers(prevLayers => {
      const updatedLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          // Update lock state
          const newLockState = !layer.locked;
          
          // Update fabric objects selectable property (inverse of locked)
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
  
  // Set active layer
  const setActiveLayer = useCallback((layerId: string) => {
    setActiveLayerId(layerId);
  }, [setActiveLayerId]);
  
  // Create new layer
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
  
  // Delete layer
  const deleteLayer = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Find the layer
    const layerToDelete = layers.find(layer => layer.id === layerId);
    if (!layerToDelete) return;
    
    // Remove objects from canvas
    layerToDelete.objects.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Update layers state
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    
    // If active layer was deleted, set first available layer as active
    if (activeLayerId === layerId) {
      const remainingLayers = layers.filter(layer => layer.id !== layerId);
      if (remainingLayers.length > 0) {
        setActiveLayerId(remainingLayers[0].id);
      }
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, layers, activeLayerId, setLayers, setActiveLayerId]);
  
  // Rename layer (inline editing)
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
        <div className="max-h-[50vh] overflow-y-auto">
          <ul className="space-y-1">
            {layers.map(layer => (
              <li 
                key={layer.id}
                className={`flex items-center gap-2 px-2 py-1 rounded-sm text-sm ${
                  activeLayerId === layer.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                <button
                  onClick={() => toggleLayerVisibility(layer.id)}
                  className="p-1 rounded hover:bg-gray-200"
                  title={layer.visible ? 'Hide layer' : 'Show layer'}
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                
                <button
                  onClick={() => toggleLayerLock(layer.id)}
                  className="p-1 rounded hover:bg-gray-200"
                  title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                >
                  {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
                
                <div 
                  className="flex-1 cursor-pointer truncate"
                  onClick={() => setActiveLayer(layer.id)}
                >
                  {layer.name}
                </div>
                
                {/* Trash button - only show if more than one layer exists */}
                {layers.length > 1 && (
                  <button
                    onClick={() => deleteLayer(layer.id)}
                    className="p-1 rounded hover:bg-red-100 hover:text-red-600"
                    title="Delete layer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
