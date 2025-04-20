
/**
 * Types for Conflict-free Replicated Data Types (CRDT) functionality
 */
import * as Y from 'yjs';

/**
 * Represents a collaborative change operation
 */
export interface CRDTOperation {
  id: number;
  type: string;
  data: any;
  timestamp: number;
  userId: string;
  userName?: string;
}

/**
 * Represents a provider for sync functionality
 */
export interface CRDTProvider {
  connect(): Promise<void>;
  disconnect(): void;
  isConnected(): boolean;
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
  broadcast(operation: CRDTOperation): void;
}

/**
 * User awareness information for collaboration
 */
export interface AwarenessUser {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  cursor?: { x: number; y: number };
}

/**
 * Configuration for CRDT functionality
 */
export interface CRDTConfig {
  roomId: string;
  userId: string;
  userName?: string;
  endpoint?: string;
  provider?: 'websocket' | 'pusher' | 'indexeddb';
  color?: string;
}

/**
 * Y.js Document wrapper
 */
export interface YjsDocument {
  doc: Y.Doc;
  map: Y.Map<any>;
  array: Y.Array<any>;
  provider?: any;
  destroy(): void;
}

/**
 * Canvas synchronization state
 */
export interface CanvasSyncState {
  canvasJson: any;
  objects: any[];
  lastModifiedBy: {
    id: string;
    name: string;
    timestamp: number;
  };
  undoStack?: any[];
  redoStack?: any[];
  metadata?: Record<string, any>;
}

/**
 * Result of CRDT sync hook
 */
export interface CRDTSyncResult {
  collaborators: {
    id: string;
    name: string;
    color: string;
    lastActive: number;
    isActive: boolean;
    lastSeen?: Date;
  }[];
  isConnected: boolean;
  syncLocalChanges: () => void;
  syncType: 'crdt' | 'simple';
}
