
import { ReactNode } from 'react';

export interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: string;
}

export interface VirtualizedLayerListProps {
  layers: DrawingLayer[];
  activeLayerId: string;
  onLayerClick: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  listHeight: number;
}

export interface LayerItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    layers: DrawingLayer[];
    activeLayerId: string;
    onLayerClick: (layerId: string) => void;
    onToggleVisibility: (layerId: string) => void;
    onToggleLock: (layerId: string) => void;
    onDeleteLayer: (layerId: string) => void;
  };
}
