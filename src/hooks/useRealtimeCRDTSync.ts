// Fix the type errors in useRealtimeCRDTSync.ts
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Type definitions
interface SyncOperation {
  id: number; // Changed from string to number
  type: string;
  data: any;
  timestamp: number;
}

interface ChannelData {
  operations: SyncOperation[];
  version: number;
}

export const useRealtimeCRDTSync = (floorPlanId: string) => {
  const [operations, setOperations] = useState<SyncOperation[]>([]);
  const [version, setVersion] = useState<number>(0);

  // Simulate fetching initial state
  useEffect(() => {
    const fetchInitialState = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setVersion(1);
    };

    fetchInitialState();
  }, [floorPlanId]);

  // Simulate real-time updates
  useEffect(() => {
    const simulateRealtimeUpdates = () => {
      // Simulate new operations from the server
      const newOperations: SyncOperation[] = [
        {
          id: Date.now(),
          type: 'add_object',
          data: { x: Math.random() * 100, y: Math.random() * 100 },
          timestamp: Date.now()
        }
      ];

      setOperations(prevOperations => [...prevOperations, ...newOperations]);
      setVersion(prevVersion => prevVersion + 1);
    };

    const intervalId = setInterval(simulateRealtimeUpdates, 3000);

    return () => clearInterval(intervalId);
  }, [floorPlanId]);

  const applyRemoteOperations = useCallback((remoteOperations: SyncOperation[]) => {
    if (!Array.isArray(remoteOperations)) return;

    remoteOperations.forEach(op => {
      console.log(`Applying operation ${op.id}: ${op.type}`);
    });
  }, []);

  useEffect(() => {
    if (operations.length > 0) {
      processRemoteOperations(operations);
    }
  }, [operations, applyRemoteOperations]);

  // Simulate processing remote operations
  const processRemoteOperations = (operations: unknown[]): void => {
    if (!Array.isArray(operations)) return;
    
    operations.forEach(operation => {
      if (operation && typeof operation === 'object') {
        // Type guard to ensure operation has id property
        const typedOperation = operation as { id?: number; type?: string; data?: any };
        if (typeof typedOperation.id === 'number' && typedOperation.type) {
          // Now it's safe to use the id property
          console.log(`Processing operation ${typedOperation.id}`);
          
          // Apply the operation...
        }
      }
    });
  };

  return {
    version,
    operations,
    applyRemoteOperations
  };
};
