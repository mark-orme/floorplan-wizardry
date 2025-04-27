
import React from 'react';

interface ToolbarSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({ 
  title, 
  children 
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};
