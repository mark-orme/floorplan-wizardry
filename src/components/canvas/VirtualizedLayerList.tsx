
import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';
import { DrawingLayer } from './types/DrawingLayer';

interface VirtualizedLayerListProps {
  layers: DrawingLayer[];
  activeLayerId: string;
  onLayerClick: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  listHeight: number;
  itemSize?: number;
}

export const VirtualizedLayerList: React.FC<VirtualizedLayerListProps> = ({
  layers,
  activeLayerId,
  onLayerClick,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer,
  listHeight,
  itemSize = 40
}) => {
  // Memoize the renderLayer function to prevent unnecessary re-renders
  const renderLayer = useMemo(() => {
    return function ItemRenderer({ index, style }: { index: number; style: React.CSSProperties }) {
      const layer = layers[index];
      
      return (
        <div 
          style={style}
          className={`flex items-center gap-2 px-2 py-1 ${
            activeLayerId === layer.id ? 'bg-blue-100 dark:bg-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          role="option"
          aria-selected={activeLayerId === layer.id}
          data-testid={`layer-item-${layer.id}`}
        >
          <button
            onClick={() => onToggleVisibility(layer.id)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={layer.visible ? 'Hide layer' : 'Show layer'}
            aria-label={layer.visible ? `Hide ${layer.name} layer` : `Show ${layer.name} layer`}
          >
            {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          
          <button
            onClick={() => onToggleLock(layer.id)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={layer.locked ? 'Unlock layer' : 'Lock layer'}
            aria-label={layer.locked ? `Unlock ${layer.name} layer` : `Lock ${layer.name} layer`}
          >
            {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
          
          <div 
            className="flex-1 cursor-pointer truncate"
            onClick={() => onLayerClick(layer.id)}
            role="button"
            tabIndex={0}
            aria-label={`Select ${layer.name} layer`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onLayerClick(layer.id);
                e.preventDefault();
              }
            }}
          >
            {layer.name}
          </div>
          
          {layers.length > 1 && (
            <button
              onClick={() => onDeleteLayer(layer.id)}
              className="p-1 rounded hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Delete layer"
              aria-label={`Delete ${layer.name} layer`}
              disabled={layers.length <= 1}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      );
    };
  }, [layers, activeLayerId, onLayerClick, onToggleVisibility, onToggleLock, onDeleteLayer]);

  return (
    <FixedSizeList
      height={listHeight}
      itemCount={layers.length}
      itemSize={itemSize}
      width="100%"
      className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
      role="listbox"
      aria-label="Drawing layers"
      itemData={layers}
      overscanCount={5} // Pre-render extra items for smoother scrolling
    >
      {renderLayer}
    </FixedSizeList>
  );
};
