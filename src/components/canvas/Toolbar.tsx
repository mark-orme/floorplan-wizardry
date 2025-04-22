import React, { useCallback } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { ToolButton } from '@/components/canvas/ToolButton';
import { UndoRedoButtons } from '@/components/canvas/UndoRedoButtons';
import { LineThicknessSlider } from '@/components/canvas/LineThicknessSlider';
import { ColorPicker } from '@/components/canvas/ColorPicker';
import { captureMessage } from '@/utils/sentry';
import { useDrawingContext } from '@/contexts/DrawingContext';

interface ToolbarProps {
  onToolChange: (tool: DrawingMode) => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  activeTool: DrawingMode;
  lineThickness: number;
  lineColor: string;
}

export const DrawingToolbar: React.FC<ToolbarProps> = React.memo(({
  onToolChange,
  onLineThicknessChange,
  onLineColorChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  activeTool,
  lineThickness,
  lineColor
}) => {
  const { canUndo, canRedo } = useDrawingContext();
  
  const handleToolSelect = useCallback((tool: DrawingMode) => {
    onToolChange(tool);
    
    captureMessage("Tool selected", {
      level: 'info',
      tags: { component: "Toolbar" },
      extra: { tool }
    });
  }, [onToolChange]);
  
  const handleClearCanvas = useCallback(() => {
    onClear();
    
    captureMessage("Canvas cleared", {
      level: 'info',
      tags: { component: "Toolbar" }
    });
  }, [onClear]);
  
  const handleExportCanvas = useCallback(() => {
    onSave();
    
    captureMessage("Canvas exported", {
      level: 'info',
      tags: { component: "Toolbar" },
      extra: { format: "png" }
    });
  }, [onSave]);
  
  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
      {/* Drawing Tools */}
      <div className="flex items-center space-x-2">
        <ToolButton
          tool={DrawingMode.SELECT}
          isActive={activeTool === DrawingMode.SELECT}
          onClick={handleToolSelect}
          title="Select"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9 0v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v-3.75m0 3.75l9 5.25m9-5.25v-3.75" />
          </svg>
        </ToolButton>
        <ToolButton
          tool={DrawingMode.DRAW}
          isActive={activeTool === DrawingMode.DRAW}
          onClick={handleToolSelect}
          title="Draw"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25v-4.5m0 4.5H7.5m4.5 0h4.5m-4.5-15L3 6.75a2.25 2.25 0 00-2.25 2.25V18a2.25 2.25 0 002.25 2.25h18a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25L12 2.25z" />
          </svg>
        </ToolButton>
        <ToolButton
          tool={DrawingMode.WALL}
          isActive={activeTool === DrawingMode.WALL}
          onClick={handleToolSelect}
          title="Wall"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
          </svg>
        </ToolButton>
        <ToolButton
          tool={DrawingMode.DOOR}
          isActive={activeTool === DrawingMode.DOOR}
          onClick={handleToolSelect}
          title="Door"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 21V3"></path>
            <path d="M4 9h16"></path>
            <path d="M14 9v12"></path>
          </svg>
        </ToolButton>
        <ToolButton
          tool={DrawingMode.WINDOW}
          isActive={activeTool === DrawingMode.WINDOW}
          onClick={handleToolSelect}
          title="Window"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
          </svg>
        </ToolButton>
        <ToolButton
          tool={DrawingMode.ROOM}
          isActive={activeTool === DrawingMode.ROOM}
          onClick={handleToolSelect}
          title="Room"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h7a2 2 0 0 1 2 2v7"></path>
            <path d="M14 3h7a2 2 0 0 0 2 2v7"></path>
            <path d="M3 14v7a2 2 0 0 0 2 2h7"></path>
            <path d="M14 14v7a2 2 0 0 1-2 2h-7"></path>
          </svg>
        </ToolButton>
      </div>
      
      {/* Line Settings */}
      <div className="flex items-center space-x-2">
        <LineThicknessSlider
          value={lineThickness}
          onChange={onLineThicknessChange}
        />
        <ColorPicker
          color={lineColor}
          onChange={onLineColorChange}
        />
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-2">
        <UndoRedoButtons
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClearCanvas}
        >
          Clear
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleExportCanvas}
        >
          Save
        </button>
      </div>
    </div>
  );
});

DrawingToolbar.displayName = 'DrawingToolbar';
