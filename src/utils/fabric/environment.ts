
/**
 * Environment utilities for Fabric.js
 * @module fabric/environment
 */

/**
 * Environment variables interface
 */
export interface EnvVars {
  /** Supabase URL */
  SUPABASE_URL: string;
  /** Supabase anonymous key */
  SUPABASE_ANON_KEY: string;
}

/**
 * Get environment variables with proper fallbacks
 * @returns {EnvVars} Environment variables
 */
export const getEnvVars = (): EnvVars => {
  return {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
};

/**
 * Canvas dimensions constants
 */
export const CANVAS_DIMENSIONS = {
  /** Minimum width for canvas */
  MIN_WIDTH: 1200,
  /** Minimum height for canvas */
  MIN_HEIGHT: 950,
  /** Default width for canvas */
  DEFAULT_WIDTH: 800,
  /** Default height for canvas */
  DEFAULT_HEIGHT: 600,
  /** Dimension change tolerance (in pixels) */
  DIMENSION_CHANGE_TOLERANCE: 20
};
