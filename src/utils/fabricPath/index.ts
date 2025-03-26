
/**
 * Fabric path utilities index
 * Re-exports all functionality from specialized modules
 * @module fabricPath
 */

// Export types
export { 
  PATH_COMMANDS, 
  COMMAND_INDICES, 
  PATH_CONSTANTS,
  type PathCommand 
} from './types';

// Export path conversion utilities
export { fabricPathToPoints } from './pathToPoints';

// Export path cleaning utilities
export { cleanPathData } from './pathCleaner';
