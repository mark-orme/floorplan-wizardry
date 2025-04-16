
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { Collaborator } from '@/hooks/realtime/useRealtimeCanvasSync';

interface UseCollaborationStatusProps {
  collaborators: Collaborator[] | number; // Updated to accept either array or number
  enableSync: boolean;
}

export const useCollaborationStatus = ({
  collaborators,
  enableSync
}: UseCollaborationStatusProps) => {
  // Show collaboration status
  useEffect(() => {
    if (enableSync) {
      const collaboratorCount = Array.isArray(collaborators) ? collaborators.length : collaborators;
      
      if (collaboratorCount > 0) {
        toast.success(`${collaboratorCount} other ${collaboratorCount === 1 ? 'user' : 'users'} editing`, {
          id: 'collab-status',
          duration: 3000
        });
      }
    }
  }, [collaborators, enableSync]);
};
