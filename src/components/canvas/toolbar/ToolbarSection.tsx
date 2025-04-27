
import React from 'react';

interface ToolbarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`toolbar-section ${className}`}>
      {title && (
        <h3 className="text-sm font-medium mb-2">{title}</h3>
      )}
      <div className="flex flex-wrap gap-1">
        {children}
      </div>
    </div>
  );
};
