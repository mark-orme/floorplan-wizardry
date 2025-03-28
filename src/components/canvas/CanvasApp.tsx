
import React from 'react';
import { useCanvasController } from './controller/CanvasController';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { DebugPanel } from './debug/DebugPanel';

/**
 * Main canvas application component
 * Handles layout and integration of canvas components
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp: React.FC = (): JSX.Element => {
  const {
    debugInfo,
    tool,
    handleToolChange,
    handleUndo,
    handleRedo,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    lineThickness,
    lineColor,
    handleLineThicknessChange,
    handleLineColorChange,
    floorPlans,
    currentFloor,
    handleFloorSelect,
    handleAddFloor,
    gia
  } = useCanvasController();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar 
        floorPlans={floorPlans}
        currentFloor={currentFloor}
        onFloorSelect={handleFloorSelect}
        onAddFloor={handleAddFloor}
        gia={gia}
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <Toolbar 
          activeTool={tool}
          onToolChange={handleToolChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={clearCanvas}
          onSave={saveCanvas}
          onDelete={deleteSelectedObjects}
          lineThickness={lineThickness}
          lineColor={lineColor}
          onLineThicknessChange={handleLineThicknessChange}
          onLineColorChange={handleLineColorChange}
        />
        
        {/* Canvas is now rendered directly inside CanvasController */}
        <div className="flex-1 overflow-hidden p-4 bg-gray-50">
          {/* The canvas element is now rendered directly in the CanvasController */}
        </div>
      </div>
      
      {/* Debug panel */}
      {debugInfo.showDebugInfo && <DebugPanel debugInfo={debugInfo} />}
    </div>
  );
};
