
import React, { useCallback } from 'react';
import { ListChildComponentProps, FixedSizeList } from 'react-window-mock';
import { DrawingLayer } from '@/components/canvas/types/DrawingLayer';

export interface VirtualizedLayerListProps {
  layers: DrawingLayer[];
  activeLayerId: string;
  onLayerClick: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  listHeight: number;
}

interface LayerListData {
  layers: DrawingLayer[];
  activeLayerId: string;
  onLayerClick: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
}

export const VirtualizedLayerList: React.FC<VirtualizedLayerListProps> = ({
  layers,
  activeLayerId,
  onLayerClick,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer,
  listHeight
}) => {
  const renderLayer = useCallback(({ index, style, data }: ListChildComponentProps<LayerListData>) => {
    const layer = data.layers[index];
    
    // Add null check to ensure layer is defined
    if (!layer) return null;
    
    return (
      <div 
        style={style}
        className={`flex items-center gap-2 px-2 py-1 ${
          data.activeLayerId === layer.id ? 'bg-blue-100' : 'hover:bg-gray-100'
        }`}
      >
        <button
          onClick={() => data.onToggleVisibility(layer.id)}
          className="p-1 rounded hover:bg-gray-200"
          title={layer.visible ? 'Hide layer' : 'Show layer'}
        >
          {layer.visible ? 'Eye Icon' : 'EyeOff Icon'}
        </button>
        
        <button
          onClick={() => data.onToggleLock(layer.id)}
          className="p-1 rounded hover:bg-gray-200"
          title={layer.locked ? 'Unlock layer' : 'Lock layer'}
        >
          {layer.locked ? 'Lock Icon' : 'Unlock Icon'}
        </button>
        
        <div 
          className="flex-1 cursor-pointer truncate"
          onClick={() => data.onLayerClick(layer.id)}
        >
          {layer.name}
        </div>
        
        {data.layers.length > 1 && (
          <button
            onClick={() => data.onDeleteLayer(layer.id)}
            className="p-1 rounded hover:bg-red-100 hover:text-red-600"
            title="Delete layer"
          >
            {'Trash Icon'}
          </button>
        )}
      </div>
    );
  }, []);

  return (
    <FixedSizeList<LayerListData>
      height={listHeight}
      itemCount={layers.length}
      itemSize={40}
      width="100%"
      className="scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
      itemData={{
        layers,
        activeLayerId,
        onLayerClick,
        onToggleVisibility,
        onToggleLock,
        onDeleteLayer
      }}
    >
      {renderLayer}
    </FixedSizeList>
  );
};
