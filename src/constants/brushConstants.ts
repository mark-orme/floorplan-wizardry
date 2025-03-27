
/**
 * Constants for brush settings and parameters
 * Used to maintain consistent brush behaviors across components
 */
export const BRUSH_CONSTANTS = {
  /** Default brush opacity */
  DEFAULT_OPACITY: 0.7,
  
  /** Default pencil color */
  DEFAULT_PENCIL_COLOR: "#000000",
  
  /** Default shadow color for drawing brushes */
  DEFAULT_SHADOW_COLOR: 'rgba(0, 0, 0, 0.2)',
  
  /** Default shadow blur amount for drawing brushes */
  DEFAULT_SHADOW_BLUR: 2,
  
  /** Default pencil brush width */
  DEFAULT_PENCIL_WIDTH: 2,  // Renamed from PENCIL_WIDTH to match usage
  
  /** Default spray brush width */
  SPRAY_WIDTH: 10,
  
  /** Default spray brush density */
  SPRAY_DENSITY: 20,
  
  /** Default spray brush randomness factor */
  SPRAY_RANDOMNESS: 0.2,
  
  /** Minimum brush width allowed */
  MIN_BRUSH_WIDTH: 0.5,
  
  /** Maximum brush width allowed */
  MAX_BRUSH_WIDTH: 50,
  
  /** Pressure sensitivity multiplier for stylus input */
  PRESSURE_MULTIPLIER: 2.5,
  
  /** Default line cap for brush strokes */
  DEFAULT_LINE_CAP: 'round',
  
  /** Default line join for brush strokes */
  DEFAULT_LINE_JOIN: 'round',
  
  /** Decimation level for path simplification */
  PATH_DECIMATION: 2
};
