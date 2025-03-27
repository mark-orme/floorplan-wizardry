
/**
 * TypeScript declarations to extend built-in interfaces
 * Adds Fabric.js specific properties to HTML elements
 */

// Extend HTMLCanvasElement to include Fabric.js runtime properties
interface HTMLCanvasElement {
  /**
   * Reference to the Fabric.js canvas instance attached to this element
   * Added by Fabric.js at runtime but not included in standard TypeScript definitions
   */
  _fabric?: unknown;
}
