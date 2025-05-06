
import React from 'react';
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

export const VirtualizedLayerList: React.FC<VirtualizedLayerListProps> = ({
  layers,
  activeLayerId,
  onLayerClick,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer,
  listHeight
}) => {
  // Placeholder implementation
  return (
    <div className="virtualized-layer-list" style={{ height: listHeight }}>
      {layers.map(layer => {
        // Add null check to ensure layer is defined
        if (!layer) return null;
        
        return (
          <div 
            key={layer.id}
            className={`layer-item ${layer.id === activeLayerId ? 'active' : ''}`}
            onClick={() => onLayerClick(layer.id)}
          >
            <span>{layer.name}</span>
            <div className="layer-actions">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
                className={`visibility-toggle ${layer.visible ? 'visible' : 'hidden'}`}
              >
                {layer.visible ? 'Hide' : 'Show'}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id); }}
                className={`lock-toggle ${layer.locked ? 'locked' : 'unlocked'}`}
              >
                {layer.locked ? 'Unlock' : 'Lock'}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
