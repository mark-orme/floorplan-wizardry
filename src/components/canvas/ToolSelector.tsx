import React from 'react';
import { Button } from '@/components/ui/button';
import {
  FiMousePointer,
  FiEdit2,
  FiType,
  FiHand,
  FiEraser
} from 'react-icons/fi';

interface ToolSelectorProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  activeTool,
  onToolSelect
}) => {
  const tools = [
    { id: 'select', icon: <FiMousePointer size={18} />, label: 'Select' },
    { id: 'pencil', icon: <FiEdit2 size={18} />, label: 'Pencil' },
    { id: 'text', icon: <FiType size={18} />, label: 'Text' },
    { id: 'hand', icon: <FiHand size={18} />, label: 'Pan' },
    { id: 'eraser', icon: <FiEraser size={18} />, label: 'Eraser' }
  ];
  
  return (
    <div className="tool-selector flex gap-1">
      {tools.map(tool => (
        <Button
          key={tool.id}
          variant={activeTool === tool.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToolSelect(tool.id)}
          title={tool.label}
        >
          {tool.icon}
        </Button>
      ))}
    </div>
  );
};
