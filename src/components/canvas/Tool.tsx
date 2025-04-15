
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';

interface ToolProps {
  name: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export const Tool: React.FC<ToolProps> = ({
  name,
  icon,
  active,
  onClick
}) => {
  return (
    <button
      className={`p-2 rounded-md transition-colors ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      onClick={onClick}
      title={name}
    >
      {icon}
    </button>
  );
};
