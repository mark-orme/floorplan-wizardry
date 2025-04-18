
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
    <div className="max-h-[50vh] overflow-hidden">
      <VirtualizedLayerList
        layers={layers}
        activeLayerId={activeLayerId}
        onLayerClick={onLayerClick}
        onToggleVisibility={onToggleVisibility}
        onToggleLock={onToggleLock}
        onDeleteLayer={onDeleteLayer}
        listHeight={Math.min(layers.length * 40, 300)}
      />
    </div>
  );
};
