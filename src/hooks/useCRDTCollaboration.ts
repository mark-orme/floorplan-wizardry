
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Automerge from '@automerge/automerge';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import { UUID } from '@/types/common';
import logger from '@/utils/logger';

// Type for document change handle function
type ChangeHandlerFn = (docId: string, changes: Uint8Array) => void;

// CRDT document type
interface CRDTDocument {
  id: string;
  objects: Record<string, any>;
  lastModified: number;
}

// Initial document
const createInitialDocument = (): CRDTDocument => ({
  id: crypto.randomUUID(),
  objects: {},
  lastModified: Date.now()
});

// Hook options
interface UseCRDTCollaborationOptions {
  canvas: FabricCanvas | null;
  roomId?: string;
  userId?: string;
  onSync?: (success: boolean) => void;
  enabled?: boolean;
}

/**
 * Hook for CRDT-based canvas collaboration
 * Uses Automerge for conflict-free replicated data type operations
 */
export function useCRDTCollaboration({
  canvas,
  roomId = 'default-room',
  userId = crypto.randomUUID(),
  onSync,
  enabled = true
}: UseCRDTCollaborationOptions) {
  // Document state
  const [syncCount, setSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  
  // Document reference
  const docRef = useRef<Automerge.Doc<CRDTDocument> | null>(null);
  const changesQueueRef = useRef<Uint8Array[]>([]);
  
  // Network handlers reference
  const handlersRef = useRef<{
    onReceiveChanges?: ChangeHandlerFn;
  }>({});
  
  // Initialize the document
  useEffect(() => {
    if (!enabled) return;
    
    // Initialize Automerge document
    docRef.current = Automerge.init<CRDTDocument>();
    docRef.current = Automerge.change(docRef.current, doc => {
      Object.assign(doc, createInitialDocument());
    });
    
    logger.info('CRDT document initialized', { roomId, userId });
    
    // Clean up
    return () => {
      docRef.current = null;
      changesQueueRef.current = [];
    };
  }, [enabled, roomId, userId]);
  
  // Sync canvas objects to the CRDT document
  const syncCanvasToDocument = useCallback(() => {
    if (!canvas || !docRef.current || !enabled) return false;
    
    try {
      setIsSyncing(true);
      
      // Get all objects from canvas but filter out non-serializable ones
      const canvasObjects = canvas.getObjects().filter(obj => {
        // Skip certain object types like grid lines or temporary objects
        return !obj.excludeFromExport && obj.type !== 'grid';
      });
      
      // Create a serializable representation
      const serializableObjects: Record<string, any> = {};
      
      canvasObjects.forEach(obj => {
        // Ensure each object has an ID
        const objId = obj.id || crypto.randomUUID();
        if (!obj.id) {
          // Set the ID if it doesn't exist
          obj.set('id', objId);
        }
        
        // Convert the object to a simple JSON representation
        // We use toObject instead of toJSON to get a normal object
        const objData = obj.toObject(['id', 'type', 'left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'angle']);
        serializableObjects[objId] = objData;
      });
      
      // Update the document with new object data
      docRef.current = Automerge.change(docRef.current, doc => {
        doc.objects = serializableObjects;
        doc.lastModified = Date.now();
      });
      
      // Generate binary changes to send to peers
      const changes = Automerge.getChanges(Automerge.init<CRDTDocument>(), docRef.current);
      
      // Update local states
      setSyncCount(prev => prev + 1);
      setLastSynced(new Date());
      setIsSyncing(false);
      
      // Call callback
      onSync?.(true);
      
      // Return changes for sending to peers
      return changes.length > 0 ? changes[0] : null;
    } catch (error) {
      logger.error('Error syncing canvas to document', { error });
      setIsSyncing(false);
      onSync?.(false);
      return false;
    }
  }, [canvas, enabled, onSync]);
  
  // Apply received changes to the document and canvas
  const applyChangesToCanvas = useCallback((changes: Uint8Array) => {
    if (!docRef.current || !canvas || !enabled) return;
    
    try {
      // Apply changes to the document
      const [newDoc, patch] = Automerge.applyChanges(docRef.current, [changes]);
      
      // If no actual changes were made, return early
      if (!patch || Object.keys(patch).length === 0) return;
      
      // Update the document reference
      docRef.current = newDoc;
      
      // Apply changes to canvas objects
      if (patch.objects) {
        // Get all existing objects for faster lookup
        const existingObjects = canvas.getObjects().reduce((acc, obj) => {
          if (obj.id) {
            acc[obj.id] = obj;
          }
          return acc;
        }, {} as Record<string, FabricObject>);
        
        // Process each changed object
        Object.entries(patch.objects).forEach(([objId, objPatch]) => {
          if (!objPatch) return;
          
          // Check if object exists in canvas
          if (existingObjects[objId]) {
            // Update existing object
            const obj = existingObjects[objId];
            
            if (objPatch.left !== undefined) obj.set('left', objPatch.left);
            if (objPatch.top !== undefined) obj.set('top', objPatch.top);
            if (objPatch.scaleX !== undefined) obj.set('scaleX', objPatch.scaleX);
            if (objPatch.scaleY !== undefined) obj.set('scaleY', objPatch.scaleY);
            if (objPatch.angle !== undefined) obj.set('angle', objPatch.angle);
            
            // Set coordinates after updating properties
            obj.setCoords();
          } else {
            // Create new object if it doesn't exist
            // This is a simplified version - in a real app, you would 
            // need to create the proper object type based on objPatch.type
            // and set all relevant properties
            const objectData = (newDoc.objects as any)[objId];
            if (!objectData || !objectData.type) return;
            
            // Here we would create the proper Fabric object based on type
            // This is just a placeholder as the actual implementation
            // would depend on your application's object types
            logger.info('Would create new object from CRDT data', { objectData });
            
            // Example (not implemented here):
            // const newObj = createFabricObject(objectData);
            // canvas.add(newObj);
          }
        });
        
        // Render all changes
        canvas.requestRenderAll();
        
        // Update sync status
        setSyncCount(prev => prev + 1);
        setLastSynced(new Date());
      }
    } catch (error) {
      logger.error('Error applying changes to canvas', { error });
    }
  }, [canvas, enabled]);
  
  // Register a change handler for receiving changes from peers
  const registerChangeHandler = useCallback((handler: ChangeHandlerFn) => {
    handlersRef.current.onReceiveChanges = handler;
    
    return () => {
      handlersRef.current.onReceiveChanges = undefined;
    };
  }, []);
  
  // Handle received changes from the network
  const handleReceivedChanges = useCallback((docId: string, changes: Uint8Array) => {
    if (docId !== roomId || !enabled) return;
    
    // Queue changes to process in order
    changesQueueRef.current.push(changes);
    
    // Process all queued changes
    if (changesQueueRef.current.length > 0 && !isSyncing) {
      const nextChanges = changesQueueRef.current.shift();
      if (nextChanges) {
        applyChangesToCanvas(nextChanges);
      }
    }
  }, [roomId, enabled, isSyncing, applyChangesToCanvas]);
  
  // Set up the change handler
  useEffect(() => {
    if (!enabled) return;
    
    // Register the handler for processing received changes
    handlersRef.current.onReceiveChanges = handleReceivedChanges;
    
    return () => {
      handlersRef.current.onReceiveChanges = undefined;
    };
  }, [enabled, handleReceivedChanges]);
  
  // Set up canvas event listeners to detect changes
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Sync when objects are modified, added, or removed
    const handleObjectModified = () => {
      const changes = syncCanvasToDocument();
      if (changes) {
        // In a real implementation, you would send these changes to peers
        logger.info('Object modified, changes ready to send', { 
          changesSize: changes.byteLength 
        });
      }
    };
    
    // Add event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);
    
    // Clean up listeners
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectModified);
      canvas.off('object:removed', handleObjectModified);
    };
  }, [canvas, enabled, syncCanvasToDocument]);
  
  return {
    syncCount,
    isSyncing,
    lastSynced,
    collaborators,
    syncNow: syncCanvasToDocument,
    registerChangeHandler
  };
}
