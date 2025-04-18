
import React from 'react';
import { VirtualizedLayerList } from '../VirtualizedLayerList';
import { DrawingLayer } from '../types/DrawingLayer';

interface LayerListContainerProps {
  layers: DrawingLayer[];
  activeLayerId: string;
  onLayerClick: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
}

export const LayerListContainer: React.FC<LayerListContainerProps> = ({
  layers,
  activeLayerId,
  onLayerClick,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer
}) => {
  return (
    <div className="max-h-[50vh] overflow-hidden border border-gray-200 rounded-md">
      <div className="p-2 bg-gray-50 font-medium border-b border-gray-200">
        Layers ({layers.length})
      </div>
      <VirtualizedLayerList
        layers={layers}
        activeLayerId={activeLayerId}
        onLayerClick={onLayerClick}
        onToggleVisibility={onToggleVisibility}
        onToggleLock={onToggleLock}
        onDeleteLayer={onDeleteLayer}
        listHeight={Math.min(layers.length * 40 + 2, 300)} /* Ensure height is appropriate */
      />
    </div>
  );
};
