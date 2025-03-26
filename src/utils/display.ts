/**
 * Utility functions for displaying formatted values
 */

/**
 * Format GIA (Gross Internal Area) value with appropriate units
 * @param {number} gia - GIA value in square meters
 * @returns {string} Formatted GIA string (e.g., "125.5" or "0")
 */
export const formatGIA = (gia: number): string => {
  if (!gia || isNaN(gia)) return "0";
  
  // Round to 1 decimal place
  return gia.toFixed(1).replace(/\.0$/, '');
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
    const cm = Math.round(value * 100);
    return compact ? `${cm}cm` : `${cm} cm`;
  }
  
  // Otherwise show in meters with 1 decimal place
  return compact 
    ? `${value.toFixed(1)}m` 
    : `${value.toFixed(1)} m`;
};

/**
 * Format a decimal number to a specified precision
 * @param {number} value - The number to format
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted number as string
 */
export const formatDecimal = (value: number, precision = 2): string => {
  if (!value || isNaN(value)) return "0";
  return value.toFixed(precision).replace(/\.0+$/, '');
};

/**
 * Format a wall length measurement with consistent 1 decimal precision
 * @param {number} length - Wall length in meters
 * @returns {string} Formatted length with 1 decimal place
 */
export const formatWallLength = (length: number): string => {
  if (!length || isNaN(length)) return "0.0";
  return length.toFixed(1);
};
