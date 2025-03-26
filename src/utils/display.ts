
/**
 * Utility functions for displaying formatted values
 * @module display
 */

/**
 * Decimal precision constants
 */
const DECIMAL_PRECISION = {
  /**
   * Precision for GIA (Gross Internal Area) values
   * @constant {number}
   */
  GIA: 1,
  
  /**
   * Precision for measurements in meters
   * @constant {number}
   */
  METERS: 1,
  
  /**
   * Precision for wall length
   * @constant {number}
   */
  WALL_LENGTH: 1,
  
  /**
   * Default precision for decimal formatting
   * @constant {number}
   */
  DEFAULT: 2
};

/**
 * Measurement conversion constants
 */
const MEASUREMENT_CONVERSION = {
  /**
   * Centimeters per meter for unit conversion
   * @constant {number}
   */
  CM_PER_METER: 100
};

/**
 * Format GIA (Gross Internal Area) value with appropriate units
 * @param {number} gia - GIA value in square meters
 * @returns {string} Formatted GIA string (e.g., "125.5" or "0")
 */
export const formatGIA = (gia: number): string => {
  if (!gia || isNaN(gia)) return "0";
  
  // Round to specified decimal places
  return gia.toFixed(DECIMAL_PRECISION.GIA).replace(/\.0$/, '');
};

/**
 * Format a measurement value with appropriate units
 * @param {number} value - Measurement value in meters
 * @param {boolean} compact - Whether to use compact format
 * @returns {string} Formatted measurement string (e.g., "2.5m" or "250cm")
 */
export const formatMeasurement = (value: number, compact = false): string => {
  if (!value || isNaN(value)) return "0";
  
  // For values less than 1 meter, show in centimeters
  if (value < 1) {
    const cm = Math.round(value * MEASUREMENT_CONVERSION.CM_PER_METER);
    return compact ? `${cm}cm` : `${cm} cm`;
  }
  
  // Otherwise show in meters with 1 decimal place
  return compact 
    ? `${value.toFixed(DECIMAL_PRECISION.METERS)}m` 
    : `${value.toFixed(DECIMAL_PRECISION.METERS)} m`;
};

/**
 * Format a decimal number to a specified precision
 * @param {number} value - The number to format
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted number as string
 */
export const formatDecimal = (value: number, precision = DECIMAL_PRECISION.DEFAULT): string => {
  if (!value || isNaN(value)) return "0";
  return value.toFixed(precision).replace(/\.0+$/, '');
};

/**
 * Format a wall length measurement with consistent decimal precision
 * @param {number} length - Wall length in meters
 * @returns {string} Formatted length with specified decimal places
 */
export const formatWallLength = (length: number): string => {
  if (!length || isNaN(length)) return "0.0";
  return length.toFixed(DECIMAL_PRECISION.WALL_LENGTH);
};
