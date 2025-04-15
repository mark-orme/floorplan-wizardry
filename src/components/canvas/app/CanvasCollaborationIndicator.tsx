
import React from 'react';

interface CanvasCollaborationIndicatorProps {
  collaborators: number;
  enabled: boolean;
}

export const CanvasCollaborationIndicator: React.FC<CanvasCollaborationIndicatorProps> = ({
  collaborators,
  enabled
}) => {
  if (!enabled || collaborators <= 0) return null;
  
  return (
    <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
      {collaborators} {collaborators === 1 ? 'user' : 'users'} collaborating
    </div>
  );
};
