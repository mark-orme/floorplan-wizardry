
import React from 'react';
import { Users } from 'lucide-react';
import { toast } from 'sonner';

interface CanvasCollaborationIndicatorProps {
  collaborators: number;
  enabled: boolean;
  isSyncing?: boolean;
  lastSyncTime?: number;
}

export const CanvasCollaborationIndicator: React.FC<CanvasCollaborationIndicatorProps> = ({
  collaborators,
  enabled,
  isSyncing = false,
  lastSyncTime
}) => {
  // Format time since last sync
  const getTimeSinceSync = () => {
    if (!lastSyncTime) return 'Never';
    
    const seconds = Math.floor((Date.now() - lastSyncTime) / 1000);
    
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };
  
  if (!enabled) {
    return null;
  }
  
  const showUserList = () => {
    toast.info(`${collaborators} active collaborator${collaborators !== 1 ? 's' : ''}`);
  };
  
  return (
    <div 
      className="absolute bottom-4 right-4 flex items-center bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-opacity-80 transition-opacity"
      onClick={showUserList}
      title="Click to see collaborators"
    >
      <div className="flex items-center mr-2">
        <Users size={16} className="mr-1.5" />
        <span className="text-sm font-medium">{collaborators}</span>
      </div>
      
      {isSyncing ? (
        <div className="flex items-center text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
          Syncing...
        </div>
      ) : (
        <div className="text-xs text-gray-300">
          {lastSyncTime ? getTimeSinceSync() : 'Not synced'}
        </div>
      )}
    </div>
  );
};
