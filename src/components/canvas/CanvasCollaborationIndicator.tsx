
import React from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  isActive: boolean;
}

interface CanvasCollaborationIndicatorProps {
  collaborators: Collaborator[];
  enabled?: boolean;
}

export const CanvasCollaborationIndicator: React.FC<CanvasCollaborationIndicatorProps> = ({
  collaborators,
  enabled = true
}) => {
  if (!enabled || collaborators.length === 0) return null;

  // Get active collaborators within the last 60 seconds
  const activeCollaborators = collaborators.filter(
    c => c.isActive && Date.now() - c.lastActive < 60000
  );

  if (activeCollaborators.length === 0) return null;

  return (
    <div className="absolute top-4 left-4 flex flex-col space-y-2 z-50">
      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
        {activeCollaborators.length} {activeCollaborators.length === 1 ? 'person' : 'people'} editing
      </Badge>
      
      <div className="flex -space-x-2">
        {activeCollaborators.slice(0, 3).map(collaborator => (
          <Tooltip key={collaborator.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarFallback 
                  style={{ backgroundColor: collaborator.color }}
                  className="text-white text-xs"
                >
                  {collaborator.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{collaborator.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {activeCollaborators.length > 3 && (
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarFallback className="bg-muted">
              +{activeCollaborators.length - 3}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
