
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
}

export interface VirtualizedLayerListProps {
  layers: Layer[];
  activeLayerId: string;
  onLayerClick: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  listHeight: number;
}
