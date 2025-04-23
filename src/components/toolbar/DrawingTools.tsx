
/**
 * Drawing tools component
 * @module components/toolbar/DrawingTools
 */
import React from 'react';
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  Text,
  Ruler
} from 'lucide-react';
import { StraightLine } from '@/components/icons/StraightLine';
import { DrawingMode } from '@/constants/drawingModes';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSection } from './ToolbarSection';

export interface DrawingToolsProps {
  /** Active drawing tool */
  activeTool: DrawingMode;
  /** Tool change handler */
  onToolChange: (tool: DrawingMode) => void;
}

/**
 * Drawing tools component
 * @param props Component props
 * @returns Rendered component
 */
export const DrawingTools: React.FC<DrawingToolsProps> = ({
  activeTool,
  onToolChange
}) => {
  // Drawing tools configuration
  const tools = [
    {
      tool: DrawingMode.SELECT,
      icon: <MousePointer size={20} />,
      label: 'Select',
      tooltip: 'Select objects'
    },
    {
      tool: DrawingMode.DRAW,
      icon: <Pencil size={20} />,
      label: 'Freehand',
      tooltip: 'Draw freehand'
    },
    {
      tool: DrawingMode.STRAIGHT_LINE,
      icon: <StraightLine size={20} />,
      label: 'Line',
      tooltip: 'Draw straight line'
    },
    {
      tool: DrawingMode.RECTANGLE,
      icon: <Square size={20} />,
      label: 'Rectangle',
      tooltip: 'Draw rectangle'
    },
    {
      tool: DrawingMode.CIRCLE,
      icon: <Circle size={20} />,
      label: 'Circle',
      tooltip: 'Draw circle'
    },
    {
      tool: DrawingMode.TEXT,
      icon: <Text size={20} />,
      label: 'Text',
      tooltip: 'Add text'
    },
    {
      tool: DrawingMode.MEASURE,
      icon: <Ruler size={20} />,
      label: 'Measure',
      tooltip: 'Measure distance'
    }
  ];
  
  // Handler for tool button click
  const handleToolClick = (tool: DrawingMode) => {
    console.log(`Tool button clicked: ${tool}`);
    onToolChange(tool);
  };
  
  return (
    <ToolbarSection title="Drawing Tools">
      {tools.map(({ tool, icon, label, tooltip }) => (
        <ToolbarButton
          key={tool}
          icon={icon}
          label={label}
          tooltip={tooltip}
          active={activeTool === tool}
          onClick={() => handleToolClick(tool)}
        />
      ))}
    </ToolbarSection>
  );
};
