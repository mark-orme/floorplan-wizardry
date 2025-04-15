
/**
 * Grid Manager
 * Central management for grid initialization and troubleshooting
 */
import logger from '@/utils/logger';

// Grid state tracking
let gridInitialized = false;
let gridCreationAttempts = 0;
const MAX_GRID_CREATION_ATTEMPTS = 3;

/**
 * Reset grid progress tracking
 */
export function resetGridProgress(): void {
  gridInitialized = false;
  gridCreationAttempts = 0;
  logger.info('Grid progress reset');
  
  // Clear any local storage related to grid
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('grid_initialized');
    window.localStorage.removeItem('grid_creation_attempts');
  }
}

/**
 * Track grid initialization attempt
 * @returns Whether this is a fresh attempt
 */
export function trackGridInitialization(): boolean {
  gridCreationAttempts++;
  
  if (gridCreationAttempts > MAX_GRID_CREATION_ATTEMPTS) {
    logger.warn(`Excessive grid creation attempts: ${gridCreationAttempts}`);
    return false;
  }
  
  logger.info(`Grid initialization attempt: ${gridCreationAttempts}`);
  return true;
}

/**
 * Mark grid as successfully initialized
 */
export function markGridInitialized(): void {
  gridInitialized = true;
  logger.info('Grid successfully initialized');
  
  // Store in local storage for persistence
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('grid_initialized', 'true');
  }
}

/**
 * Check if grid has been successfully initialized
 * @returns Whether grid is initialized
 */
export function isGridInitialized(): boolean {
  // Check both in-memory and local storage
  if (gridInitialized) return true;
  
  if (typeof window !== 'undefined') {
    const storedValue = window.localStorage.getItem('grid_initialized');
    return storedValue === 'true';
  }
  
  return false;
}

/**
 * Initialize global grid helpers
 */
export function initializeGridHelpers(): void {
  if (typeof window !== 'undefined') {
    (window as any).gridHelpers = {
      resetGridProgress,
      isGridInitialized,
      forceGridInitialization: markGridInitialized
    };
    
    logger.info('Grid helpers initialized on window.gridHelpers');
  }
}

// Initialize helpers when this module loads
initializeGridHelpers();
