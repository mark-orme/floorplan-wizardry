
import React from 'react';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { LockIcon, UnlockIcon } from 'lucide-react';
import { Trash2Icon } from 'lucide-react';

interface LayerItem {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
}

interface VirtualizedLayerListProps {
  layers: LayerItem[];
  onToggleLayerVisibility: (id: string) => void;
  onToggleLayerLock: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onSelectLayer: (id: string) => void;
  selectedLayerId?: string;
}

export const VirtualizedLayerList: React.FC<VirtualizedLayerListProps> = ({
  layers,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onDeleteLayer,
  onSelectLayer,
  selectedLayerId
}) => {
  return (
    <div className="layer-list overflow-y-auto max-h-[300px]">
      {layers.map(layer => (
        <div
          key={layer.id}
          className={`layer-item flex items-center justify-between p-2 hover:bg-gray-100 transition-colors ${
            selectedLayerId === layer.id ? 'bg-blue-100' : ''
          }`}
          onClick={() => onSelectLayer(layer.id)}
        >
          <div className="layer-name truncate flex-1">{layer.name}</div>
          <div className="layer-actions flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLayerVisibility(layer.id);
              }}
              title={layer.visible ? 'Hide Layer' : 'Show Layer'}
            >
              {layer.visible ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeOffIcon className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLayerLock(layer.id);
              }}
              title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
            >
              {layer.locked ? (
                <LockIcon className="h-4 w-4" />
              ) : (
                <UnlockIcon className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteLayer(layer.id);
              }}
              title="Delete Layer"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
