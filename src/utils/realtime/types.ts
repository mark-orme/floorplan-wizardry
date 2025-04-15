
/**
 * Type definitions for real-time synchronization
 */

/**
 * Floor plan data structure for synchronization
 */
export interface SyncFloorPlan {
  /** Unique identifier for the floor plan */
  id: string;
  
  /** Display name for the floor plan */
  name: string;
  
  /** Canvas JSON representation (stringified) */
  canvasJson: string;
  
  /** Last update timestamp (ISO string) */
  updatedAt: string;
  
  /** Additional metadata for the floor plan */
  metadata?: {
    /** User who performed the sync */
    syncedBy?: string;
    
    /** Timestamp when sync occurred */
    syncTimestamp?: number;
    
    /** Any additional metadata properties */
    [key: string]: any;
  };
  
  /** Any additional properties */
  [key: string]: any;
}

/**
 * Result type for the real-time canvas sync hook
 */
export interface RealtimeCanvasSyncResult {
  /** Last sync timestamp */
  lastSyncTime: number;
  
  /** Number of active collaborators */
  collaborators: number;
  
  /** Function to manually trigger sync */
  syncCanvas: (userName: string) => void;
}
