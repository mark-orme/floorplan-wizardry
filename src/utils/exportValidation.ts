
/**
 * Export Validation Utility
 * 
 * Helps detect potential duplicate exports during development
 * @module utils/exportValidation
 */

// Track exported names across modules
const exportRegistry = new Map<string, string[]>();

/**
 * Register an export to detect potential duplicates
 * 
 * @param name Name being exported
 * @param sourceModule Source module path
 * @returns true if this is a new export, false if potentially duplicated
 */
export function registerExport(name: string, sourceModule: string): boolean {
  const sources = exportRegistry.get(name) || [];
  const isDuplicate = sources.length > 0;
  
  // Add this source if not already registered
  if (!sources.includes(sourceModule)) {
    sources.push(sourceModule);
    exportRegistry.set(name, sources);
  }
  
  // Log warning if we have a duplicate
  if (isDuplicate) {
    console.warn(
      `Warning: '${name}' is exported from multiple sources:`,
      sources.join(', '),
      '- This may cause ambiguity errors'
    );
  }
  
  return !isDuplicate;
}

/**
 * Check for duplicate exports across the entire application
 * 
 * @returns Array of export names with duplicate sources
 */
export function checkDuplicateExports(): Array<{name: string, sources: string[]}> {
  const duplicates: Array<{name: string, sources: string[]}> = [];
  
  // Find all exports with multiple sources
  for (const [name, sources] of exportRegistry.entries()) {
    if (sources.length > 1) {
      duplicates.push({name, sources});
    }
  }
  
  return duplicates;
}

/**
 * Clear the export registry (useful for testing)
 */
export function clearExportRegistry(): void {
  exportRegistry.clear();
}

/**
 * Best practices for avoiding duplicate exports
 */
export const EXPORT_BEST_PRACTICES = {
  /**
   * Use named exports instead of wildcard re-exports
   * Example: export { func1, func2 } from './module';
   */
  USE_NAMED_EXPORTS: "Use named exports instead of wildcard re-exports",
  
  /**
   * Use unique names or rename exports that might conflict
   * Example: export { func as uniqueFunc } from './module';
   */
  RENAME_POTENTIAL_CONFLICTS: "Rename exports that might conflict with other modules",
  
  /**
   * Group related functionality in namespaces
   * Example: export const GridUtils = { func1, func2 };
   */
  USE_NAMESPACES: "Group related functionality in namespaces",
  
  /**
   * Be explicit about what you're exporting
   * Avoid: export * from './module';
   */
  BE_EXPLICIT: "Be explicit about what you're exporting",
  
  /**
   * Add unique prefixes to commonly used names
   * Example: gridSnapToPoint, geometrySnapToPoint
   */
  USE_PREFIXES: "Add module prefixes to commonly used function names"
};
