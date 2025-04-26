
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import {
  Database,
  Grid,
  RefreshCw,
  Eye,
  EyeOff,
  Trash
} from '@/components/ui/icons';
import { Button } from '@/components/ui/button';

interface GridDiagnosticToolsProps {
  canvas: FabricCanvas | null;
  gridObjects: any[];
  onToggleGridVisibility: () => void;
  onRefreshGrid: () => void;
  onResetGrid: () => void;
  showDiagnostics?: boolean;
}

export const GridDiagnosticTools: React.FC<GridDiagnosticToolsProps> = ({
  canvas,
  gridObjects,
  onToggleGridVisibility,
  onRefreshGrid,
  onResetGrid,
  showDiagnostics = false
}) => {
  if (!canvas || !showDiagnostics) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-md shadow-md p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Grid className="w-4 h-4 mr-1" />
          Grid Tools
        </h3>
        <span className="text-xs text-gray-500">
          {gridObjects.length} objects
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-1">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs"
          onClick={onToggleGridVisibility}
        >
          <Eye className="w-3 h-3 mr-1" />
          Toggle
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs"
          onClick={onRefreshGrid}
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
        
        <Button 
          size="sm" 
          variant="destructive" 
          className="text-xs"
          onClick={onResetGrid}
        >
          <Trash className="w-3 h-3 mr-1" />
          Reset
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs"
          onClick={() => console.log('Diagnostic data:', { gridObjects, canvas })}
        >
          <Database className="w-3 h-3 mr-1" />
          Log
        </Button>
      </div>
    </div>
  );
};
