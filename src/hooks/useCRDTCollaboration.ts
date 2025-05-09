import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useYjs } from 'yjs-reactjs-hooks';
import * as Y from 'yjs';

interface UseCRDTCollaborationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  documentId: string;
}

export const useCRDTCollaboration = ({
  fabricCanvasRef,
  documentId,
}: UseCRDTCollaborationProps) => {
  const [isReady, setIsReady] = useState(false);
  const { ydoc, provider } = useYjs<{ objects: Y.Array<any> }>(documentId, () => ({
    objects: new Y.Array()
  }));
  const isSynced = provider?.awareness.synced;
  const objects = ydoc?.getArray('objects');
  
  const initialLoadRef = useRef(false);

  // Helper function to serialize fabric objects
  const serializeObject = (obj: any) => {
    if (!obj) return null;
    
    try {
      if (typeof obj.toObject === 'function') {
        return obj.toObject();
      }
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      console.error('Error serializing object:', e);
      return null;
    }
  };

  // Helper function to add a new object to the shared document
  const addObjectToDocument = useCallback((obj: any) => {
    if (!objects) return;
    
    const serialized = serializeObject(obj);
    if (serialized) {
      objects.push([serialized]);
    }
  }, [objects]);

  // Helper function to remove an object from the shared document
  const removeObjectFromDocument = useCallback((id: string) => {
    if (!objects) return;
    
    objects.forEach((element, index) => {
      if (element && element.id === id) {
        objects.delete(index, 1);
      }
    });
  }, [objects]);

  // Helper function to modify an object in the shared document
  const modifyObjectInDocument = useCallback((id: string, properties: any) => {
    if (!objects) return;
    
    objects.forEach((element, index) => {
      if (element && element.id === id) {
        objects.delete(index, 1);
        objects.insert(index, [properties]);
      }
    });
  }, [objects]);

  // Function to send a CRDT operation
  const sendOperation = useCallback((operation: any) => {
    switch (operation.type) {
      case 'add':
        addObjectToDocument(operation.object);
        break;
      case 'remove':
        removeObjectFromDocument(operation.id);
        break;
      case 'modify':
        modifyObjectInDocument(operation.id, operation.properties);
        break;
      default:
        console.warn('Unknown operation type:', operation.type);
    }
  }, [addObjectToDocument, removeObjectFromDocument, modifyObjectInDocument]);

  // Handle object addition to the canvas
  const handleObjectAddition = useCallback((e: any) => {
    if (!e || !e.target) return;
    
    try {
      addObjectToDocument(e.target);
    } catch (error) {
      console.error('Error handling object addition:', error);
    }
  }, [addObjectToDocument]);

  // Handle object removal from the canvas
  const handleObjectRemoval = useCallback((e: any) => {
    if (!e || !e.target) return;
    
    try {
      removeObjectFromDocument(e.target.id);
    } catch (error) {
      console.error('Error handling object removal:', error);
    }
  }, [removeObjectFromDocument]);

  // Handle object modification on the canvas
  const handleObjectModification = (e: any) => {
    if (!e || !e.target) return;
    
    try {
      // Only proceed if the object exists
      if (e.target && typeof e.target.toJSON === 'function') {
        // Safely call methods on the object
        sendOperation({
          type: 'modify',
          id: e.target.id,
          properties: e.target.toJSON()
        });
      }
    } catch (error) {
      console.error('Error handling object modification:', error);
    }
  };

  // Sync canvas objects with the shared document
  useEffect(() => {
    if (!fabricCanvasRef.current || !objects || !isSynced) return;
    
    // Load initial objects from Yjs document to canvas
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      
      // Clear existing objects on canvas
      fabricCanvasRef.current.clear();
      
      // Load objects from Yjs
      objects.forEach(item => {
        if (item) {
          try {
            fabricCanvasRef.current?.loadFromJSON(
              { objects: [item] },
              () => {
                fabricCanvasRef.current?.renderAll();
              }
            );
          } catch (e) {
            console.error('Error loading object from JSON:', e);
          }
        }
      });
      
      fabricCanvasRef.current.renderAll();
    }
    
    // Observe Yjs array changes and update canvas
    const observer = (event: Y.YArrayEvent<any>) => {
      if (!fabricCanvasRef.current) return;
      
      event.changes.delta.forEach(change => {
        if (change.insert) {
          change.insert.forEach(item => {
            if (item) {
              try {
                fabricCanvasRef.current?.loadFromJSON(
                  { objects: [item] },
                  () => {
                    fabricCanvasRef.current?.renderAll();
                  }
                );
              } catch (e) {
                console.error('Error loading object from JSON:', e);
              }
            }
          });
        } else if (change.delete) {
          for (let i = 0; i < change.delete; i++) {
            // Remove objects from canvas based on ID
            const objectsToRemove = fabricCanvasRef.current?.getObjects().filter(obj => {
              const yjsIndex = objects.toArray().findIndex(yjsObj => yjsObj.id === (obj as any).id);
              return yjsIndex !== -1;
            }) || [];
            
            objectsToRemove.forEach(obj => {
              fabricCanvasRef.current?.remove(obj);
            });
          }
        }
      });
      
      fabricCanvasRef.current.renderAll();
    };
    
    objects.observe(observer);
    setIsReady(true);
    
    return () => {
      objects.unobserve(observer);
    };
  }, [fabricCanvasRef, objects, isSynced]);

  // Attach event listeners to the canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.on('object:added', handleObjectAddition);
    canvas.on('object:removed', handleObjectRemoval);
    canvas.on('object:modified', handleObjectModification);

    return () => {
      canvas.off('object:added', handleObjectAddition);
      canvas.off('object:removed', handleObjectRemoval);
      canvas.off('object:modified', handleObjectModification);
    };
  }, [fabricCanvasRef, handleObjectAddition, handleObjectRemoval, handleObjectModification]);

  return {
    isReady
  };
};
