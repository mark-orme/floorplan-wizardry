
import { useCallback, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { persistCanvasState, restoreCanvasState } from '@/utils/canvas/persistenceManager';

interface UseCanvasErrorRecoveryProps {
  canvas: FabricCanvas | null;
  onRecoveryStart?: () => void;
  onRecoveryComplete?: (success: boolean) => void;
}

export const useCanvasErrorRecovery = ({
  canvas,
  onRecoveryStart,
  onRecoveryComplete
}: UseCanvasErrorRecoveryProps) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const recoveryAttemptsRef = useRef(0);
  const MAX_RECOVERY_ATTEMPTS = 3;

  const attemptRecovery = useCallback(async () => {
    if (!canvas || isRecovering) return false;

    try {
      setIsRecovering(true);
      onRecoveryStart?.();
      recoveryAttemptsRef.current++;

      logger.info('Starting canvas recovery attempt', {
        attempt: recoveryAttemptsRef.current,
        maxAttempts: MAX_RECOVERY_ATTEMPTS
      });

      // Try restoring from saved state first
      const restored = await restoreCanvasState(canvas);
      
      if (restored) {
        logger.info('Canvas recovered from saved state');
        toast.success('Canvas recovered successfully');
        onRecoveryComplete?.(true);
        return true;
      }

      // If restoration fails and we haven't exceeded max attempts,
      // try clearing and reinitializing
      if (recoveryAttemptsRef.current < MAX_RECOVERY_ATTEMPTS) {
        canvas.clear();
        canvas.renderAll();
        
        // Persist clean state
        await persistCanvasState(canvas);
        
        logger.info('Canvas reinitialized');
        toast.success('Canvas reinitialized successfully');
        onRecoveryComplete?.(true);
        return true;
      }

      // If all recovery attempts fail
      logger.error('Canvas recovery failed after maximum attempts');
      toast.error('Unable to recover canvas state');
      onRecoveryComplete?.(false);
      return false;
    } catch (error) {
      logger.error('Error during canvas recovery:', error);
      toast.error('Error during recovery');
      onRecoveryComplete?.(false);
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [canvas, isRecovering, onRecoveryStart, onRecoveryComplete]);

  const resetRecoveryAttempts = useCallback(() => {
    recoveryAttemptsRef.current = 0;
  }, []);

  return {
    isRecovering,
    attemptRecovery,
    resetRecoveryAttempts,
    recoveryAttempts: recoveryAttemptsRef.current
  };
};
