
/**
 * Hook for throttled canvas synchronization
 */
import { useRef } from 'react';

/**
 * Props for throttled sync hook
 */
interface UseThrottledSyncProps {
  syncFn: () => boolean;
  throttleTime: number;
}

/**
 * Hook to throttle canvas synchronization
 */
export const useThrottledSync = ({
  syncFn,
  throttleTime
}: UseThrottledSyncProps) => {
  // Reference to track last sync time
  const lastSyncTimeRef = useRef<number>(0);
  const pendingSyncTimeoutRef = useRef<number | null>(null);
  
  // Throttled sync function
  const throttledSync = () => {
    // Clear any pending sync timeout
    if (pendingSyncTimeoutRef.current !== null) {
      window.clearTimeout(pendingSyncTimeoutRef.current);
      pendingSyncTimeoutRef.current = null;
    }
    
    // Check if we should throttle
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncTimeRef.current;
    
    if (timeSinceLastSync < throttleTime) {
      // Schedule a sync for later
      pendingSyncTimeoutRef.current = window.setTimeout(() => {
        syncFn();
        pendingSyncTimeoutRef.current = null;
      }, throttleTime - timeSinceLastSync);
    } else {
      // Sync immediately
      syncFn();
    }
  };
  
  // Cleanup function
  const cleanup = () => {
    if (pendingSyncTimeoutRef.current !== null) {
      window.clearTimeout(pendingSyncTimeoutRef.current);
      pendingSyncTimeoutRef.current = null;
    }
  };
  
  return {
    throttledSync,
    lastSyncTimeRef,
    cleanup
  };
};
