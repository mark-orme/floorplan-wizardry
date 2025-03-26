
/**
 * Environment and configuration utilities for Fabric.js
 * @module fabric/environment
 */
import logger from '@/utils/logger';

/**
 * Default canvas dimensions
 */
export const CANVAS_DIMENSIONS = {
  width: 800,
  height: 600
};

/**
 * Environment variables with defaults
 */
const ENV_DEFAULTS = {
  CANVAS_WIDTH: CANVAS_DIMENSIONS.width.toString(),
  CANVAS_HEIGHT: CANVAS_DIMENSIONS.height.toString(),
  GRID_SIZE: '20',
  PIXELS_PER_METER: '100',
  DEBUG_MODE: 'false'
};

/**
 * Get environment variables with fallbacks to defaults
 * @returns Environment variables
 */
export const getEnvVars = () => {
  const env = {
    CANVAS_WIDTH: process.env.CANVAS_WIDTH || ENV_DEFAULTS.CANVAS_WIDTH,
    CANVAS_HEIGHT: process.env.CANVAS_HEIGHT || ENV_DEFAULTS.CANVAS_HEIGHT,
    GRID_SIZE: process.env.GRID_SIZE || ENV_DEFAULTS.GRID_SIZE,
    PIXELS_PER_METER: process.env.PIXELS_PER_METER || ENV_DEFAULTS.PIXELS_PER_METER,
    DEBUG_MODE: process.env.DEBUG_MODE || ENV_DEFAULTS.DEBUG_MODE
  };
  
  return {
    ...env,
    isDebugMode: env.DEBUG_MODE.toLowerCase() === 'true'
  };
};

/**
 * Set a canvas to match environment dimensions
 * @param canvas - Canvas to set dimensions for
 */
export const setCanvasDimensionsFromEnv = (canvas: HTMLCanvasElement | null): void => {
  if (!canvas) {
    logger.error("Cannot set dimensions for null canvas");
    return;
  }
  
  try {
    const env = getEnvVars();
    const width = parseInt(env.CANVAS_WIDTH);
    const height = parseInt(env.CANVAS_HEIGHT);
    
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    logger.info(`Canvas dimensions set to ${width}x${height} from environment`);
  } catch (error) {
    logger.error("Error setting canvas dimensions from environment:", error);
  }
};
