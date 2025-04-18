
import React, { useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Layers, Plus } from 'lucide-react';
import { LayerListContainer } from './layers/LayerListContainer';
import { useLayerActions } from './layers/useLayerActions';
import { DrawingLayer } from './types/DrawingLayer';

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
  
  const { 
    toggleLayerVisibility,
    toggleLayerLock,
    setActiveLayer,
    createNewLayer,
    deleteLayer
  } = useLayerActions({ 
    fabricCanvasRef, 
    layers, 
    setLayers, 
    activeLayerId, 
    setActiveLayerId 
  });
  
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
        <LayerListContainer
          layers={layers}
          activeLayerId={activeLayerId}
          onLayerClick={setActiveLayer}
          onToggleVisibility={toggleLayerVisibility}
          onToggleLock={toggleLayerLock}
          onDeleteLayer={deleteLayer}
        />
      )}
    </div>
  );
};
