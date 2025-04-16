
/**
 * Grid debug panel component
 * @module components/canvas/GridDebugPanel
 */
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Bug, X } from 'lucide-react';
import { DebugSection } from './debug/DebugSection';
import { GridStats } from './debug/GridStats';
import { CanvasStats } from './debug/CanvasStats';
import { ActionButton } from './debug/ActionButton';

export interface GridDebugPanelProps {
  /** Fabric canvas instance */
  canvas: FabricCanvas | null;
  /** Whether the panel is visible */
  visible?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Grid size */
  gridSize?: number;
  /** Grid color */
  gridColor?: string;
  /** Grid line thickness */
  gridLineThickness?: number;
  /** Force create grid handler */
  onForceCreateGrid?: () => void;
  /** Refresh canvas handler */
  onRefreshCanvas?: () => void;
  /** Current zoom level */
  zoomLevel?: number;
}

/**
 * Grid debug panel component
 * @param props Component props
 * @returns Rendered component
 */
const GridDebugPanel: React.FC<GridDebugPanelProps> = ({
  canvas,
  visible = true,
  onClose,
  gridSize = 20,
  gridColor = '#cccccc',
  gridLineThickness = 0.5,
  onForceCreateGrid,
  onRefreshCanvas,
  zoomLevel = 1
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gridCreated, setGridCreated] = useState(false);
  const [gridObjectCount, setGridObjectCount] = useState(0);
  
  // Toggle panel open/closed
  const togglePanel = () => setIsOpen(!isOpen);
  
  // Count grid objects in canvas
  useEffect(() => {
    if (!canvas) return;
    
    const updateGridStats = () => {
      const objects = canvas.getObjects();
      const gridObjects = objects.filter(obj => 
        obj.data && (obj.data.type === 'grid' || obj.data.isGridLine)
      );
      
      setGridObjectCount(gridObjects.length);
      setGridCreated(gridObjects.length > 0);
    };
    
    updateGridStats();
    
    const handleObjectAdded = () => updateGridStats();
    const handleObjectRemoved = () => updateGridStats();
    
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas]);
  
  if (!visible) return null;
  
  return (
    <div className="absolute right-4 bottom-4 z-10">
      {/* Button to toggle panel */}
      {!isOpen && (
        <button
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          onClick={togglePanel}
          title="Debug Grid"
        >
          <Bug size={20} />
        </button>
      )}
      
      {/* Debug panel */}
      {isOpen && (
        <div className="w-64 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
            <h3 className="text-sm font-medium flex items-center">
              <Bug size={16} className="mr-1" />
              Grid Debug Panel
            </h3>
            
            <div className="flex items-center space-x-1">
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={togglePanel}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Panel content */}
          <div className="max-h-96 overflow-y-auto">
            <DebugSection
              title="Grid Info"
              defaultExpanded
            >
              <GridStats
                canvas={canvas}
                gridCreated={gridCreated}
                gridSize={gridSize}
                gridColor={gridColor}
                gridLineThickness={gridLineThickness}
                gridObjectCount={gridObjectCount}
              />
            </DebugSection>
            
            <DebugSection
              title="Canvas Info"
              defaultExpanded
            >
              <CanvasStats
                canvas={canvas}
                zoomLevel={zoomLevel}
              />
            </DebugSection>
            
            <DebugSection
              title="Actions"
              defaultExpanded
            >
              <div className="flex flex-col space-y-2">
                <ActionButton
                  label="Force Recreate Grid"
                  onClick={onForceCreateGrid || (() => {})}
                  variant="warning"
                />
                
                <ActionButton
                  label="Refresh Canvas"
                  onClick={onRefreshCanvas || (() => {})}
                  variant="default"
                />
              </div>
            </DebugSection>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridDebugPanel;
