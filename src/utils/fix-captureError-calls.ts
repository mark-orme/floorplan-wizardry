
/**
 * This file provides documentation on how to fix all the captureMessage 
 * and captureError calls that pass three arguments.
 */

/**
 * HOW TO FIX THREE-ARGUMENT SENTRY CALLS
 * 
 * 1. Find all calls to captureMessage and captureError with 3 arguments:
 *    captureMessage(message, context, extraData)
 *    captureError(error, context, extraData)
 * 
 * 2. Replace them with the new two-argument signatures:
 *    captureMessage(message, { tags: { context: context }, extra: extraData })
 *    captureError(error, { tags: { context: context }, extra: extraData })
 * 
 * Examples:
 * 
 * Old:
 *    captureMessage("Grid created", "grid-layer", { count: 10 });
 * 
 * New:
 *    captureMessage("Grid created", { 
 *      tags: { context: "grid-layer" },
 *      extra: { count: 10 }
 *    });
 * 
 * Old:
 *    captureError(error, "canvas-operation", { tool: currentTool });
 * 
 * New:
 *    captureError(error, {
 *      tags: { context: "canvas-operation" },
 *      extra: { tool: currentTool }
 *    });
 */

// Example function with three arguments (deprecated)
export function oldCaptureMessage(message: string, context: string, extraData: object) {
  // No implementation, just a reference
  console.log("Deprecated - Don't use this function");
}

// Example function with options object (current)
export function newCaptureMessage(message: string, options: { tags?: Record<string, string>, extra?: object }) {
  // No implementation, just a reference
  console.log("Correct pattern - Use this format");
}

// Example of a one-by-one update method for each file
export function updateExamples() {
  // Find:
  // captureMessage("Canvas error", "canvas-component", { error: err.message });
  
  // Replace with:
  // captureMessage("Canvas error", { 
  //   tags: { context: "canvas-component" },
  //   extra: { error: err.message }
  // });
  
  
  // Find:
  // captureError(error, "grid-layer", { dimensions: canvasDimensions });
  
  // Replace with:
  // captureError(error, {
  //   tags: { context: "grid-layer" },
  //   extra: { dimensions: canvasDimensions }
  // });
}
