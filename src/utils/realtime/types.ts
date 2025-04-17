
/**
 * Types for real-time synchronization
 */

export interface SyncFloorPlan {
  id: string;
  name: string;
  canvasJson: string;
  updatedAt: string;
  metadata?: {
    syncedBy: string;
    syncTimestamp: number;
    dimension?: {
      width: number;
      height: number;
    };
  };
}

export interface CollaboratorInfo {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  isActive: boolean;
}

export type { Collaborator as RealtimeCanvasSyncResult } from '@/hooks/realtime/useRealtimeCanvasSync';
