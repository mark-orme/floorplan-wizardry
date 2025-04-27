
import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2 
} from 'lucide-react';
import { DrawingLayer } from './types/DrawingLayer';
import VirtualizedList from '@/components/VirtualizedList';
import logger from '@/utils/logger';

interface VirtualizedLayerListProps {
  layers: DrawingLayer[];
  activeLayerId: string;
  onLayerClick: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  listHeight: number;
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
  logger.debug('Rendering layer list', { layerCount: layers.length });

  const renderLayer = (layer: DrawingLayer, _index: number, style: React.CSSProperties) => (
    <div 
      style={style}
      className={`flex items-center gap-2 px-2 py-1 ${
        activeLayerId === layer.id ? 'bg-blue-100' : 'hover:bg-gray-100'
      }`}
      role="option"
      aria-selected={activeLayerId === layer.id}
    >
      <button
        onClick={() => onToggleVisibility(layer.id)}
        className="p-1 rounded hover:bg-gray-200"
        title={layer.visible ? 'Hide layer' : 'Show layer'}
      >
        {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      
      <button
        onClick={() => onToggleLock(layer.id)}
        className="p-1 rounded hover:bg-gray-200"
        title={layer.locked ? 'Unlock layer' : 'Lock layer'}
      >
        {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
      </button>
      
      <div 
        className="flex-1 cursor-pointer truncate"
        onClick={() => onLayerClick(layer.id)}
      >
        {layer.name}
      </div>
      
      {layers.length > 1 && (
        <button
          onClick={() => onDeleteLayer(layer.id)}
          className="p-1 rounded hover:bg-red-100 hover:text-red-600"
          title="Delete layer"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );

  return (
    <VirtualizedList
      items={layers}
      renderItem={renderLayer}
      maxHeight={listHeight}
      className="scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
    />
  );
};
