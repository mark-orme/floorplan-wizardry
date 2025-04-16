
import React from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Collaborator } from '@/hooks/realtime/useRealtimeCanvasSync';

interface CanvasCollaborationIndicatorProps {
  collaborators: Collaborator[];
  enabled: boolean;
}

export const CanvasCollaborationIndicator: React.FC<CanvasCollaborationIndicatorProps> = ({
  collaborators,
  enabled
}) => {
  if (!enabled) return null;
  
  const activeCollaborators = collaborators.filter(
    c => c.isActive && Date.now() - c.lastActive < 60000 // Active in the last minute
  );
  
  if (activeCollaborators.length === 0) return null;
  
  return (
    <div className="absolute top-4 left-4 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 bg-white/80 hover:bg-white">
              <Users className="h-3.5 w-3.5" />
              <span>{activeCollaborators.length}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-semibold mb-1">Active collaborators:</div>
              <ul className="space-y-1">
                {activeCollaborators.map(user => (
                  <li key={user.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: user.color }}
                    />
                    <span>{user.name}</span>
                    <span className="text-xs text-gray-500">
                      {user.lastSeen.toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
