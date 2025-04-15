
/**
 * Types for the real-time synchronization
 */
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Props for the useRealtimeCanvasSync hook
 */
export interface RealtimeCanvasSyncProps {
  /**
   * The Fabric canvas instance
   */
  canvas: FabricCanvas | null;
  
  /**
   * Enable/disable syncing
   */
  enabled: boolean;
  
  /**
   * Optional callback when remote update is received
   */
  onRemoteUpdate?: (sender: string, timestamp: number) => void;
  
  /**
   * Throttle time for sending updates (ms)
   */
  throttleTime?: number;
}

/**
 * Floor plan data structure for synchronization
 */
export interface SyncFloorPlan {
  id: string;
  name: string;
  canvasJson: string;
  updatedAt: string;
  metadata?: {
    syncedBy?: string;
    syncTimestamp?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Return type for the useRealtimeCanvasSync hook
 */
export interface RealtimeCanvasSyncResult {
  syncCanvas: () => boolean;
  collaborators: number;
  lastSyncTime: number;
  isSyncing: boolean;
}
