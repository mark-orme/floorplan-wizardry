
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AiOutlineSelect,
  AiOutlineEdit,
} from 'react-icons/ai';
import { FiType } from 'react-icons/fi';
import { AiOutlineHighlight } from 'react-icons/ai';
import { BiSolidHandLeft } from 'react-icons/bi';

interface ToolSelectorProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  activeTool,
  onToolSelect
}) => {
  const tools = [
    { id: 'select', icon: <AiOutlineSelect size={18} />, label: 'Select' },
    { id: 'pencil', icon: <AiOutlineEdit size={18} />, label: 'Pencil' },
    { id: 'text', icon: <FiType size={18} />, label: 'Text' },
    { id: 'hand', icon: <BiSolidHandLeft size={18} />, label: 'Pan' },
    { id: 'eraser', icon: <AiOutlineHighlight size={18} />, label: 'Eraser' }
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
