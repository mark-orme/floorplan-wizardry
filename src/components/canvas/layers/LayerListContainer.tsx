
import React from 'react';
import { DrawingLayer } from '@/components/canvas/types/DrawingLayer';
import { VirtualizedLayerList } from './VirtualizedLayerList';

interface LayerListContainerProps {
  layers: DrawingLayer[];
  activeLayerId: string;
  onLayerClick: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  listHeight: number;
}

export const LayerListContainer: React.FC<LayerListContainerProps> = (props) => {
  const {
    layers,
    activeLayerId,
    onLayerClick,
    onToggleVisibility,
    onToggleLock,
    onDeleteLayer,
    listHeight
  } = props;
  
  return (
    <div className="layers-container border rounded-md p-2 bg-background">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Layers</h3>
        <span className="text-xs text-muted-foreground">{layers.length} layers</span>
      </div>
      
      <VirtualizedLayerList
        layers={layers}
        activeLayerId={activeLayerId}
        onLayerClick={onLayerClick}
        onToggleVisibility={onToggleVisibility}
        onToggleLock={onToggleLock}
        onDeleteLayer={onDeleteLayer}
        listHeight={listHeight}
      />
    </div>
  );
};
