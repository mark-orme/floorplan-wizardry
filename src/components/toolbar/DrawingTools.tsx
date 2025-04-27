
import React from 'react';
import { Icons } from '@/constants/iconMappings';
import { DrawingMode } from '@/constants/drawingModes';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSection } from './ToolbarSection';

export interface DrawingToolsProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
}

export const DrawingTools: React.FC<DrawingToolsProps> = ({
  activeTool,
  onToolChange
}) => {
  const tools = [
    {
      tool: DrawingMode.SELECT,
      icon: <Icons.select size={20} />,
      label: 'Select',
      tooltip: 'Select objects'
    },
    {
      tool: DrawingMode.DRAW,
      icon: <Icons.edit size={20} />,
      label: 'Freehand',
      tooltip: 'Draw freehand'
    },
    {
      tool: DrawingMode.STRAIGHT_LINE,
      icon: <Icons.minus size={20} />,
      label: 'Line',
      tooltip: 'Draw straight line'
    },
    {
      tool: DrawingMode.RECTANGLE,
      icon: <Icons.square size={20} />,
      label: 'Rectangle',
      tooltip: 'Draw rectangle'
    }
  ];
  
  return (
    <ToolbarSection title="Drawing Tools">
      {tools.map(({ tool, icon, label, tooltip }) => (
        <ToolbarButton
          key={tool}
          icon={icon}
          label={label}
          tooltip={tooltip}
          active={activeTool === tool}
          onClick={() => onToolChange(tool)}
        />
      ))}
    </ToolbarSection>
  );
};
