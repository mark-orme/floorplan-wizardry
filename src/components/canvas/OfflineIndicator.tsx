
import React from "react";

interface OfflineIndicatorProps {
  isOffline: boolean;
}

/**
 * Offline indicator component
 * Shows a notification when the user is offline
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOffline }) => {
  if (!isOffline) return null;
  
  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md shadow-md z-50 flex items-center">
      <span className="relative flex h-3 w-3 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
      </span>
      <span>Offline Mode - Your work is saved locally</span>
    </div>
  );
};
