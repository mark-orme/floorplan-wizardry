
import { useEffect } from 'react';
import { toast } from 'sonner';

interface UseCollaborationStatusProps {
  collaborators: number;
  enableSync: boolean;
}

export const useCollaborationStatus = ({
  collaborators,
  enableSync
}: UseCollaborationStatusProps) => {
  // Show collaboration status
  useEffect(() => {
    if (enableSync && collaborators > 0) {
      toast.success(`${collaborators} other ${collaborators === 1 ? 'user' : 'users'} editing`, {
        id: 'collab-status',
        duration: 3000
      });
    }
  }, [collaborators, enableSync]);
};
