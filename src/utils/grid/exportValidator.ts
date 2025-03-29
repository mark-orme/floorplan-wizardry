
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
 * Detect ambiguous re-exports across barrel files
 * @param barrelFilePath - Path to the barrel file (e.g., index.ts)
 * @param sourceMap - Map of export names to their source files
 * @returns Array of ambiguous exports with their sources
 */
export function detectAmbiguousExports(
  barrelFilePath: string,
  sourceMap: Map<string, string[]>
): { name: string; sources: string[] }[] {
  const ambiguousExports: { name: string; sources: string[] }[] = [];
  
  // Find exports with multiple sources
  for (const [name, sources] of sourceMap.entries()) {
    if (sources.length > 1) {
      ambiguousExports.push({ name, sources });
      
      console.warn(
        `⚠️ Ambiguous export detected in ${barrelFilePath}: '${name}' is exported from multiple sources:`,
        sources.join(', ')
      );
    }
  }
  
  return ambiguousExports;
}

/**
 * Track exports in a barrel file to detect ambiguity
 * @param exportName - Name of export
 * @param sourcePath - Path to source file
 * @param barrelPath - Path to barrel file
 * @param sourceMap - Map to track sources
 */
export function trackBarrelExport(
  exportName: string,
  sourcePath: string,
  barrelPath: string,
  sourceMap: Map<string, string[]> = new Map()
): void {
  // Get or create the array of sources for this export
  const sources = sourceMap.get(exportName) || [];
  
  // Add this source if it's not already included
  if (!sources.includes(sourcePath)) {
    sources.push(sourcePath);
    sourceMap.set(exportName, sources);
    
    // Check if this is now ambiguous (more than one source)
    if (sources.length > 1) {
      console.warn(
        `⚠️ Potential ambiguous export in ${barrelPath}: '${exportName}' is now exported from multiple sources:`,
        sources.join(', ')
      );
    }
  }
}

/**
 * NEW: Check for direct exports that conflict with wildcard re-exports
 * @param barrelFilePath - Path to the barrel file
 * @param directExports - Array of direct export names in the barrel file
 * @param wildcardModules - Array of paths to modules being re-exported with wildcard
 * @returns Array of conflicting export names
 */
export function checkForWildcardConflicts(
  barrelFilePath: string,
  directExports: string[],
  wildcardModules: string[]
): string[] {
  const conflictingExports: string[] = [];
  
  // For each direct export, check if it might conflict with a wildcard re-export
  for (const exportName of directExports) {
    for (const modulePath of wildcardModules) {
      try {
        // In a real implementation, you would dynamically load the module
        // and check if it exports the same name
        // For now, we'll just log a warning
        console.warn(
          `⚠️ Potential conflict: '${exportName}' is directly exported in ${barrelFilePath} and may also be exported via wildcard from ${modulePath}`
        );
        conflictingExports.push(exportName);
      } catch (error) {
        console.error(`Error checking exports in ${modulePath}:`, error);
      }
    }
  }
  
  return conflictingExports;
}

/**
 * NEW: Validate barrel file exports during development or build time
 * @param barrelFilePath - Path to the barrel file
 * @returns Validation result with any issues found
 */
export function validateBarrelFile(barrelFilePath: string): {
  valid: boolean;
  ambiguousExports: string[];
  wildcardConflicts: string[];
} {
  // This is a simplified implementation that would need to be expanded
  // with actual file system access in a real project
  
  const ambiguousExports: string[] = [];
  const wildcardConflicts: string[] = [];
  
  // For demonstration purposes only
  console.log(`Validating barrel file: ${barrelFilePath}`);
  
  return {
    valid: ambiguousExports.length === 0 && wildcardConflicts.length === 0,
    ambiguousExports,
    wildcardConflicts
  };
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
  USE_EXPLICIT_REEXPORTS: "Use explicit re-exports to avoid name conflicts",
  
  /**
   * NEW: Avoid direct exports in barrel files that use wildcards
   * This prevents ambiguous exports that can be difficult to debug
   */
  AVOID_DIRECT_EXPORTS_WITH_WILDCARDS: "Avoid direct exports in barrel files that also use wildcard exports",
  
  /**
   * NEW: Use import type for type-only imports
   * This prevents issues with circular dependencies for types
   */
  USE_IMPORT_TYPE: "Use import type for type-only imports to prevent circular dependencies"
};

/**
 * NEW: Rule checker for barrel files to prevent common issues
 */
export function checkBarrelFileRules(
  barrelFilePath: string,
  fileContent: string
): { 
  valid: boolean;
  violations: Array<{ rule: string; message: string }>
} {
  const violations: Array<{ rule: string; message: string }> = [];
  
  // Check if the file has both wildcard exports and direct exports
  const hasWildcardExports = /export \* from/.test(fileContent);
  const hasDirectExports = /export (const|function|class|type|interface|enum)/.test(fileContent);
  
  if (hasWildcardExports && hasDirectExports) {
    violations.push({
      rule: "AVOID_DIRECT_EXPORTS_WITH_WILDCARDS",
      message: `Barrel file ${barrelFilePath} contains both wildcard exports and direct exports. Consider using only explicit named re-exports.`
    });
  }
  
  // Check for duplicate name exports (would require more sophisticated parsing)
  
  return {
    valid: violations.length === 0,
    violations
  };
}
