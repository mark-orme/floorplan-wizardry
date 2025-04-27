
import React from 'react';
import {
  MousePointerIcon,
  PencilIcon,
  UndoIcon,
  RedoIcon,
  ZoomInIcon,
  ZoomOutIcon,
  LayoutGridIcon,
  TrashIcon,
  WifiIcon,
  WifiOffIcon,
  TypeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolbarContainerProps {
  onToolSelect: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onToggleSync: () => void;
  activeTool: string;
  canUndo: boolean;
  canRedo: boolean;
  showGrid: boolean;
  synced: boolean;
}

export const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  onToolSelect,
  onUndo,
  onRedo,
  onClear,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onToggleSync,
  activeTool,
  canUndo,
  canRedo,
  showGrid,
  synced
}) => {
  return (
    <div className="toolbar-container p-2 bg-white border-b flex items-center space-x-1">
      <Button 
        variant={activeTool === 'select' ? 'default' : 'outline'}
        size="icon" 
        onClick={() => onToolSelect('select')}
        title="Select"
      >
        <MousePointerIcon className="h-4 w-4" />
      </Button>
      
      <Button 
        variant={activeTool === 'draw' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onToolSelect('draw')}
        title="Draw"
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      
      <Button 
        variant={activeTool === 'text' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onToolSelect('text')}
        title="Text"
      >
        <TypeIcon className="h-4 w-4" />
      </Button>
      
      <div className="h-6 border-r mx-1"></div>
      
      <Button 
        variant="outline"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
      >
        <UndoIcon className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo"
      >
        <RedoIcon className="h-4 w-4" />
      </Button>
      
      <div className="h-6 border-r mx-1"></div>
      
      <Button 
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <ZoomInIcon className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <ZoomOutIcon className="h-4 w-4" />
      </Button>
      
      <Button 
        variant={showGrid ? 'default' : 'outline'}
        size="icon"
        onClick={onToggleGrid}
        title={showGrid ? 'Hide Grid' : 'Show Grid'}
      >
        <LayoutGridIcon className="h-4 w-4" />
      </Button>
      
      <div className="h-6 border-r mx-1"></div>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={onClear}
        title="Clear Canvas"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
      
      <div className="flex-1"></div>
      
      <Button
        variant={synced ? 'default' : 'outline'}
        size="icon"
        onClick={onToggleSync}
        title={synced ? 'Disable Sync' : 'Enable Sync'}
      >
        {synced ? (
          <WifiIcon className="h-4 w-4" />
        ) : (
          <WifiOffIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
