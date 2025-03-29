
/**
 * Grid Export Validator
 * 
 * Utility to validate exports and prevent ambiguous or duplicate exports
 * This can be used during development or in tests to ensure export integrity
 * 
 * @module grid/exportValidator
 */

/**
 * Tracked exports to check for duplication
 */
const trackedExports = new Map<string, string>();

/**
 * Registers an export to track potential duplicates
 * 
 * @param exportName - Name of the exported item
 * @param sourceFile - Source file path
 * @returns true if registration was successful, false if duplicate
 */
export function registerExport(exportName: string, sourceFile: string): boolean {
  if (trackedExports.has(exportName)) {
    console.warn(
      `Warning: Export '${exportName}' from '${sourceFile}' conflicts with existing export from '${trackedExports.get(exportName)}'`
    );
    return false;
  }
  
  trackedExports.set(exportName, sourceFile);
  return true;
}

/**
 * Validates that an imported name exists in the exports
 * 
 * @param importName - Name of the imported item
 * @param sourceFile - Source file path
 * @returns true if the import is valid
 */
export function validateImport(importName: string, sourceFile: string): boolean {
  const exists = trackedExports.has(importName);
  
  if (!exists) {
    console.error(`Error: Import '${importName}' in '${sourceFile}' has no matching export`);
  }
  
  return exists;
}

/**
 * Gets all exported names for validation
 */
export function getAllExportNames(): string[] {
  return Array.from(trackedExports.keys());
}

/**
 * Gets source file for an export
 * 
 * @param exportName - Name of the export
 * @returns Source file path or undefined if not found
 */
export function getExportSource(exportName: string): string | undefined {
  return trackedExports.get(exportName);
}

/**
 * Checks for ambiguous exports in index files
 * 
 * @param indexFilePath - Path to the index file
 * @param exportedNames - Array of exported names
 * @returns Array of ambiguous exports if any
 */
export function checkForAmbiguousExports(
  indexFilePath: string, 
  exportedNames: string[]
): string[] {
  const nameCounts = new Map<string, number>();
  
  // Count occurrences of each name
  exportedNames.forEach(name => {
    nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
  });
  
  // Filter for names that appear more than once
  const ambiguousExports = Array.from(nameCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([name]) => name);
  
  if (ambiguousExports.length > 0) {
    console.warn(
      `Warning: Ambiguous exports found in '${indexFilePath}': ${ambiguousExports.join(', ')}`
    );
  }
  
  return ambiguousExports;
}

/**
 * Clear all tracked exports (useful for testing)
 */
export function clearTrackedExports(): void {
  trackedExports.clear();
}

/**
 * Best practices for exports
 */
export const EXPORT_BEST_PRACTICES = {
  /**
   * Use named exports instead of default exports
   * This makes imports more consistent and prevents naming issues
   */
  USE_NAMED_EXPORTS: "Use named exports instead of default exports for consistency",
  
  /**
   * Be explicit in re-exports
   * Instead of `export * from './module'`, use `export { specificItem } from './module'`
   */
  BE_EXPLICIT_IN_REEXPORTS: "Be explicit in re-exports to avoid ambiguity",
  
  /**
   * Use consistent naming
   * Follow naming conventions that make the purpose of exports clear
   */
  USE_CONSISTENT_NAMING: "Use consistent naming patterns for exports",
  
  /**
   * Limit exports per file
   * Keep each file focused on a specific responsibility
   */
  LIMIT_EXPORTS_PER_FILE: "Limit exports per file to maintain focus",
  
  /**
   * Document exports
   * Use JSDoc to document the purpose and usage of exports
   */
  DOCUMENT_EXPORTS: "Document exports with JSDoc comments",
  
  /**
   * NEW: Avoid ambiguous exports
   * Don't export the same name from multiple sources
   */
  AVOID_AMBIGUOUS_EXPORTS: "Avoid exporting the same name from multiple sources",
  
  /**
   * NEW: Use explicit re-exports
   * When re-exporting from multiple modules, use named exports
   */
  USE_EXPLICIT_REEXPORTS: "Use explicit re-exports to avoid name conflicts"
};
