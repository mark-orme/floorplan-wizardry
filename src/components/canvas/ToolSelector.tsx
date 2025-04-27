
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  MousePointerIcon,
  PencilIcon,
  TypeIcon,
  HandIcon,
  EraserIcon
} from 'lucide-react';

interface ToolSelectorProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  activeTool,
  onToolSelect
}) => {
  const tools = [
    { id: 'select', icon: <MousePointerIcon size={18} />, label: 'Select' },
    { id: 'pencil', icon: <PencilIcon size={18} />, label: 'Pencil' },
    { id: 'text', icon: <TypeIcon size={18} />, label: 'Text' },
    { id: 'hand', icon: <HandIcon size={18} />, label: 'Pan' },
    { id: 'eraser', icon: <EraserIcon size={18} />, label: 'Eraser' }
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
