
/**
 * CRDT Collaboration Hook
 * Provides real-time collaboration with conflict-free replicated data types
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

// Define operation types
type OperationType = 'add' | 'update' | 'delete' | 'clear' | 'transform';

// Define timestamp for operations
interface Timestamp {
  clientId: string;
  counter: number;
}

// Define operation structure
interface Operation {
  id: string;
  type: OperationType;
  targetId?: string;
  data?: any;
  timestamp: Timestamp;
}

// Define collaboration options
interface CollaborationOptions {
  roomId: string;
  userId: string;
  onEvent?: (event: string, data: any) => void;
}

/**
 * Hook for CRDT-based canvas collaboration
 * Uses operation-based CRDTs for conflict resolution
 */
export function useCRDTCollaboration(
  canvas: FabricCanvas | null,
  pusherClient: any,
  options: CollaborationOptions
) {
  const { roomId, userId, onEvent } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // CRDT state
  const clientId = useRef(userId || uuidv4());
  const opCounter = useRef(0);
  const operationLog = useRef<Operation[]>([]);
  const incomingQueue = useRef<Operation[]>([]);
  const channelRef = useRef<any>(null);
  
  // Process operations on the canvas
  const processOperation = useCallback((operation: Operation) => {
    if (!canvas) return;
    
    try {
      switch (operation.type) {
        case 'add':
          if (operation.data) {
            // Add object to canvas from serialized data
            fabric.util.enlivenObjects([operation.data], (objects) => {
              const obj = objects[0];
              // Set object ID to ensure consistency
              obj.set('id', operation.targetId);
              canvas.add(obj);
              canvas.requestRenderAll();
            });
          }
          break;
          
        case 'update':
          if (operation.targetId && operation.data) {
            // Find object by ID
            const obj = findObjectById(canvas, operation.targetId);
            if (obj) {
              // Update object properties
              obj.set(operation.data);
              obj.setCoords();
              canvas.requestRenderAll();
            }
          }
          break;
          
        case 'delete':
          if (operation.targetId) {
            // Find and remove object
            const obj = findObjectById(canvas, operation.targetId);
            if (obj) {
              canvas.remove(obj);
              canvas.requestRenderAll();
            }
          }
          break;
          
        case 'clear':
          // Clear canvas
          canvas.clear();
          break;
          
        case 'transform':
          if (operation.targetId && operation.data) {
            // Apply transformation
            const obj = findObjectById(canvas, operation.targetId);
            if (obj) {
              // Apply transformation matrix
              obj.set({
                left: operation.data.left,
                top: operation.data.top,
                scaleX: operation.data.scaleX,
                scaleY: operation.data.scaleY,
                angle: operation.data.angle,
              });
              obj.setCoords();
              canvas.requestRenderAll();
            }
          }
          break;
      }
      
      // Add to operation log
      operationLog.current.push(operation);
      
    } catch (error) {
      console.error('Error processing operation:', error);
    }
  }, [canvas]);
  
  // Helper to find object by ID
  const findObjectById = (canvas: FabricCanvas, id: string) => {
    return canvas.getObjects().find(obj => (obj as any).id === id);
  };
  
  // Create a new operation
  const createOperation = useCallback((
    type: OperationType,
    targetId?: string,
    data?: any
  ): Operation => {
    const counter = opCounter.current++;
    
    return {
      id: uuidv4(),
      type,
      targetId,
      data,
      timestamp: {
        clientId: clientId.current,
        counter
      }
    };
  }, []);
  
  // Send operation to peers
  const sendOperation = useCallback((operation: Operation) => {
    if (channelRef.current) {
      channelRef.current.trigger('client-operation', operation);
      
      // Process locally
      processOperation(operation);
    }
  }, [processOperation]);
  
  // Generate object ID for consistency
  const generateObjectId = useCallback(() => {
    return `${clientId.current}-${uuidv4()}`;
  }, []);
  
  // Initialize connection
  useEffect(() => {
    if (!pusherClient || !roomId) return;
    
    try {
      // Subscribe to the collaboration channel
      const channel = pusherClient.subscribe(`presence-canvas-${roomId}`);
      channelRef.current = channel;
      
      // Handle subscription success
      channel.bind('pusher:subscription_succeeded', (data: any) => {
        setIsConnected(true);
        setConnectionError(null);
        
        // Extract list of active users
        const users = Object.keys(data.members).map(id => id);
        setActiveUsers(users);
        
        if (onEvent) {
          onEvent('connected', { users });
        }
      });
      
      // Handle new members
      channel.bind('pusher:member_added', (member: any) => {
        setActiveUsers(prev => [...prev, member.id]);
        
        if (onEvent) {
          onEvent('user_joined', { userId: member.id });
        }
      });
      
      // Handle members leaving
      channel.bind('pusher:member_removed', (member: any) => {
        setActiveUsers(prev => prev.filter(id => id !== member.id));
        
        if (onEvent) {
          onEvent('user_left', { userId: member.id });
        }
      });
      
      // Handle incoming operations
      channel.bind('client-operation', (operation: Operation) => {
        // Skip operations from this client
        if (operation.timestamp.clientId === clientId.current) return;
        
        // Add to queue and process
        incomingQueue.current.push(operation);
        processOperation(operation);
      });
      
      // Handle connection errors
      channel.bind('pusher:subscription_error', (error: any) => {
        setIsConnected(false);
        setConnectionError(`Connection error: ${error.message || 'Unknown error'}`);
        
        if (onEvent) {
          onEvent('error', { error: error.message });
        }
      });
      
      // Clean up on unmount
      return () => {
        channel.unbind_all();
        pusherClient.unsubscribe(`presence-canvas-${roomId}`);
      };
    } catch (error) {
      console.error('Error initializing collaboration:', error);
      setConnectionError(`Initialization error: ${(error as Error).message}`);
      return () => {};
    }
  }, [pusherClient, roomId, onEvent, processOperation]);
  
  // Set up canvas event handlers
  useEffect(() => {
    if (!canvas || !isConnected) return;
    
    // Handle object added
    const handleObjectAdded = (e: any) => {
      const obj = e.target;
      if (!obj) return;
      
      // Skip if this is from a remote operation
      if ((obj as any)._fromRemote) return;
      
      // Ensure object has ID
      if (!(obj as any).id) {
        (obj as any).id = generateObjectId();
      }
      
      // Create operation
      const data = obj.toObject(['id']);
      const operation = createOperation('add', (obj as any).id, data);
      sendOperation(operation);
    };
    
    // Handle object modified
    const handleObjectModified = (e: any) => {
      const obj = e.target;
      if (!obj) return;
      
      // Skip if this is from a remote operation
      if ((obj as any)._fromRemote) return;
      
      // Create operation
      const data = obj.toObject(['left', 'top', 'scaleX', 'scaleY', 'angle']);
      const operation = createOperation('update', (obj as any).id, data);
      sendOperation(operation);
    };
    
    // Handle object removed
    const handleObjectRemoved = (e: any) => {
      const obj = e.target;
      if (!obj) return;
      
      // Skip if this is from a remote operation
      if ((obj as any)._fromRemote) return;
      
      // Create operation
      const operation = createOperation('delete', (obj as any).id);
      sendOperation(operation);
    };
    
    // Set up event listeners
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Clean up on unmount
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas, isConnected, createOperation, sendOperation, generateObjectId]);
  
  // Exposed API methods
  const clearCanvas = useCallback(() => {
    if (!canvas || !isConnected) return;
    
    const operation = createOperation('clear');
    sendOperation(operation);
  }, [canvas, isConnected, createOperation, sendOperation]);
  
  // Get operation log
  const getOperationLog = useCallback(() => {
    return [...operationLog.current];
  }, []);
  
  return {
    isConnected,
    activeUsers,
    connectionError,
    clientId: clientId.current,
    clearCanvas,
    getOperationLog
  };
}

/**
 * Helper function to find object by ID
 */
function findObjectById(canvas: FabricCanvas, id: string) {
  return canvas.getObjects().find(obj => (obj as any).id === id);
}
