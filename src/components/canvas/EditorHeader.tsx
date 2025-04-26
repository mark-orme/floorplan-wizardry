import React from "react";
import { Canvas as FabricCanvas } from "fabric";
// Fix the import to use our mock icons
import { Home, Grid, EyeOff, RefreshCw } from "@/components/ui/icons";

interface EditorHeaderProps {
  canvas: FabricCanvas | null;
  showGrid: boolean;
  onToggleGrid: () => void;
  onResetView: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  canvas,
  showGrid,
  onToggleGrid,
  onResetView
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-white border rounded" onClick={() => alert('Home')}>
          <Home className="w-4 h-4" />
        </button>
        
        <button 
          className={`p-2 border rounded ${showGrid ? 'bg-blue-100 text-blue-800' : 'bg-white'}`} 
          onClick={onToggleGrid}
        >
          <Grid className="w-4 h-4" />
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-white border rounded" onClick={onResetView}>
          <RefreshCw className="w-4 h-4" />
          Reset View
        </button>
      </div>
    </div>
  );
};
