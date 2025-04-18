
import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';

interface ToolSelectorProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  orientation?: 'horizontal' | 'vertical';
  compact?: boolean;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  activeTool,
  onToolChange,
  orientation = 'vertical',
  compact = false
}) => {
  const tools = [
    { id: DrawingMode.SELECT, name: 'Select', icon: '👆' },
    { id: DrawingMode.DRAW, name: 'Draw', icon: '✏️' },
    { id: DrawingMode.STRAIGHT_LINE, name: 'Line', icon: '📏' },
    { id: DrawingMode.ERASER, name: 'Erase', icon: '🧹' },
    { id: DrawingMode.HAND, name: 'Pan', icon: '✋' }
  ];
  
  return (
    <div className={`flex ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'} gap-1 p-1 bg-background/80 backdrop-blur-sm rounded-lg border shadow-md`}>
      {tools.map((tool) => (
        <Button
          key={tool.id}
          size={compact ? 'icon' : 'default'}
          variant={activeTool === tool.id ? 'default' : 'outline'}
          onClick={() => onToolChange(tool.id)}
          className={compact ? 'h-9 w-9' : ''}
          title={tool.name}
        >
          {compact ? (
            <span className="text-base">{tool.icon}</span>
          ) : (
            <span className="flex items-center gap-2">
              <span>{tool.icon}</span>
              <span>{tool.name}</span>
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};
