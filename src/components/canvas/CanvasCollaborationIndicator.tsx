
import React, { useMemo } from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Collaborator } from '@/hooks/useRealtimeSync';

interface CanvasCollaborationIndicatorProps {
  collaborators: Collaborator[];
  enabled: boolean;
  syncType?: 'crdt' | 'simple';
}

export const CanvasCollaborationIndicator: React.FC<CanvasCollaborationIndicatorProps> = ({
  collaborators,
  enabled,
  syncType = 'crdt'
}) => {
  // Don't show anything if collaboration is disabled
  if (!enabled) return null;
  
  // Only show active collaborators from the last minute
  const activeCollaborators = useMemo(() => 
    collaborators.filter(c => c.isActive && Date.now() - c.lastActive < 60000),
    [collaborators]
  );
  
  // Don't show anything if there are no active collaborators
  if (activeCollaborators.length === 0) return null;
  
  return (
    <div className="absolute top-4 left-4 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${
                syncType === 'crdt' 
                  ? 'bg-green-100 hover:bg-green-200 border-green-300' 
                  : 'bg-blue-100 hover:bg-blue-200 border-blue-300'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>{activeCollaborators.length}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-semibold mb-1">
                {syncType === 'crdt' 
                  ? 'CRDT Collaboration Active' 
                  : 'Simple Collaboration Active'}
              </div>
              <ul className="space-y-1">
                {activeCollaborators.map(user => (
                  <li key={user.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: user.color }}
                    />
                    <span>{user.name}</span>
                    {user.lastSeen && (
                      <span className="text-xs text-gray-500">
                        {new Date(user.lastActive).toLocaleTimeString()}
                      </span>
                    )}
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

export default CanvasCollaborationIndicator;
