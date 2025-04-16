
/**
 * Real-time synchronization types
 * @module utils/realtime/types
 */

/**
 * Synchronized floor plan data
 */
export interface SyncFloorPlan {
  id: string;
  name: string;
  canvasJson: string;
  updatedAt: string;
  metadata: {
    syncedBy: string;
    syncTimestamp: number;
    [key: string]: any;
  };
}

/**
 * Result of the useRealtimeCanvasSync hook
 */
export interface RealtimeCanvasSyncResult {
  /** Timestamp of the last synchronization */
  lastSyncTime: number;
  
  /** Number of active collaborators */
  collaborators: number;
  
  /** Whether a sync operation is in progress */
  isSyncing: boolean;
  
  /** Function to sync canvas state */
  syncCanvas: (userName: string) => void;
}

/**
 * Canvas sync event types
 */
export enum CanvasSyncEventType {
  UPDATE = 'update',
  JOIN = 'join',
  LEAVE = 'leave'
}

/**
 * Canvas presence state
 */
export interface CanvasPresenceState {
  userId: string;
  deviceId: string;
  name: string;
  cursor?: {
    x: number;
    y: number;
  };
  isActive: boolean;
  lastActivity: number;
}
