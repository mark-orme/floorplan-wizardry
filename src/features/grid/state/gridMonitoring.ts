
import { Canvas as FabricCanvas } from 'fabric';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';

interface GridStatus {
  gridExists: boolean;
  gridVisible: boolean;
  gridObjectCount: number;
  visibleGridObjectCount: number;
  lastCheckTimestamp: number;
  consecutiveFailures: number;
  recoveryAttempts: number;
}

// Global state for grid monitoring
let gridStatus: GridStatus = {
  gridExists: false,
  gridVisible: false,
  gridObjectCount: 0,
  visibleGridObjectCount: 0,
  lastCheckTimestamp: 0,
  consecutiveFailures: 0,
  recoveryAttempts: 0
};

/**
 * Check grid health and report any issues
 * @param canvas The fabric canvas to check
 * @returns Status of the grid
 */
export function checkGridHealth(canvas: FabricCanvas | null): GridStatus {
  if (!canvas) {
    gridStatus.gridExists = false;
    gridStatus.gridVisible = false;
    gridStatus.gridObjectCount = 0;
    gridStatus.visibleGridObjectCount = 0;
    gridStatus.lastCheckTimestamp = Date.now();
    return gridStatus;
  }
  
  try {
    // Find grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    
    const gridCount = gridObjects.length;
    const visibleGridCount = gridObjects.filter(obj => obj.visible === true).length;
    
    // Update global grid status
    const previousStatus = { ...gridStatus };
    gridStatus.gridExists = gridCount > 0;
    gridStatus.gridVisible = visibleGridCount > 0;
    gridStatus.gridObjectCount = gridCount;
    gridStatus.visibleGridObjectCount = visibleGridCount;
    gridStatus.lastCheckTimestamp = Date.now();
    
    // Handle failure detection
    const hasFailure = !gridStatus.gridExists || !gridStatus.gridVisible;
    
    if (hasFailure) {
      gridStatus.consecutiveFailures++;
      
      // Log escalating warnings based on failure count
      if (gridStatus.consecutiveFailures === 1) {
        logger.warn('Grid issue detected', gridStatus);
      } else if (gridStatus.consecutiveFailures === 3) {
        logger.error('Persistent grid issue detected', gridStatus);
        
        // Report to Sentry after multiple failures
        captureMessage(
          'Grid health check failed repeatedly',
          'grid-health-failure',
          {
            level: 'warning',
            tags: {
              gridExists: String(gridStatus.gridExists),
              gridVisible: String(gridStatus.gridVisible),
              consecutiveFailures: String(gridStatus.consecutiveFailures)
            },
            extra: {
              currentStatus: gridStatus,
              previousStatus,
              canvasInfo: {
                width: canvas.width,
                height: canvas.height,
                objectCount: canvas.getObjects().length
              }
            }
          }
        );
      }
    } else {
      // Reset failure count if check passes
      if (gridStatus.consecutiveFailures > 0) {
        logger.info('Grid issues resolved', gridStatus);
      }
      gridStatus.consecutiveFailures = 0;
    }
    
    // Update global state for Sentry
    if (window.__canvas_state) {
      window.__canvas_state.gridVisible = gridStatus.gridVisible;
    }
    
    return gridStatus;
  } catch (error) {
    logger.error('Error checking grid health', { error });
    return gridStatus;
  }
}

/**
 * Register a recovery attempt for the grid
 */
export function registerGridRecoveryAttempt(): void {
  gridStatus.recoveryAttempts++;
  
  logger.info('Grid recovery attempt registered', {
    totalAttempts: gridStatus.recoveryAttempts,
    consecutiveFailures: gridStatus.consecutiveFailures
  });
  
  // Report significant retry counts to Sentry
  if (gridStatus.recoveryAttempts === 3 || gridStatus.recoveryAttempts === 10) {
    captureMessage(
      `Grid recovery attempted ${gridStatus.recoveryAttempts} times`,
      'grid-recovery-attempts',
      {
        level: gridStatus.recoveryAttempts >= 10 ? 'error' : 'warning',
        tags: {
          recoveryAttempts: String(gridStatus.recoveryAttempts),
          consecutiveFailures: String(gridStatus.consecutiveFailures)
        },
        extra: {
          status: gridStatus
        }
      }
    );
  }
}

/**
 * Reset grid monitoring state (e.g., for new session)
 */
export function resetGridMonitoring(): void {
  gridStatus = {
    gridExists: false,
    gridVisible: false,
    gridObjectCount: 0,
    visibleGridObjectCount: 0,
    lastCheckTimestamp: 0,
    consecutiveFailures: 0,
    recoveryAttempts: 0
  };
}

/**
 * Get current grid status
 * @returns Current grid status
 */
export function getGridStatus(): GridStatus {
  return { ...gridStatus };
}
