
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  isActive: boolean;
  lastSeen: Date;
}

interface CanvasCollaborationIndicatorProps {
  collaborators: Collaborator[];
  enabled: boolean;
}

export const CanvasCollaborationIndicator: React.FC<CanvasCollaborationIndicatorProps> = ({
  collaborators,
  enabled
}) => {
  if (!enabled || collaborators.length === 0) return null;
  
  const activeCollaborators = collaborators.filter(c => c.isActive);
  
  return (
    <Badge 
      variant="outline"
      className="absolute top-4 right-4 z-10 bg-blue-50 flex items-center gap-1.5 text-blue-700"
    >
      <Users className="h-3.5 w-3.5" />
      <span>{activeCollaborators.length} online</span>
    </Badge>
  );
};
