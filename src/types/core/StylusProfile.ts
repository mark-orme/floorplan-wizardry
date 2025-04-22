
/**
 * StylusProfile interface
 * Represents a user-calibrated profile for stylus input
 */
export interface StylusProfile {
  /** Unique identifier for the profile */
  id: string;
  
  /** User-given name for the profile */
  name: string;
  
  /** Pressure curve mapping (normalized input → output values) */
  pressureCurve: number[];
  
  /** Tilt curve mapping (optional, for angle-based effects) */
  tiltCurve?: number[];
  
  /** When the profile was last calibrated */
  lastCalibrated: Date;
}

/**
 * Default stylus profile with standard pressure curve
 */
export const DEFAULT_STYLUS_PROFILE: StylusProfile = {
  id: 'default',
  name: 'Default',
  pressureCurve: [0, 0.25, 0.5, 0.75, 1], // Linear pressure mapping
  lastCalibrated: new Date()
};
