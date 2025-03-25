
/**
 * Utility functions for formatting display values
 */

/**
 * Format a GIA (Gross Internal Area) value with 2 decimal places
 * @param gia - The GIA value to format
 * @returns Formatted GIA string with 2 decimal places
 */
export const formatGIA = (gia: number): string => {
  return gia.toFixed(2);
};

/**
 * Format a measurement with appropriate units
 * @param value - The measurement value in meters
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted measurement string with units
 */
export const formatMeasurement = (value: number, precision: number = 2): string => {
  return `${value.toFixed(precision)}m`;
};

/**
 * Format a distance for display in the UI
 * @param distance - The distance in meters
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string => {
  if (distance < 0.01) {
    // Show in mm for very small distances
    return `${Math.round(distance * 1000)}mm`;
  } else if (distance < 1) {
    // Show in cm for small distances
    return `${Math.round(distance * 100)}cm`;
  } else {
    // Show in meters with 2 decimal places for larger distances
    return `${distance.toFixed(2)}m`;
  }
};
