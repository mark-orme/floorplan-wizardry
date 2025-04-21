
/**
 * Utility to prevent common naming issues in the application
 * This runs in development mode to check for potential build-breaking naming issues
 */

/**
 * Detects and warns about common file naming issues
 */
export function detectNamingIssues(): void {
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Check for case sensitivity issues in imports
      const importMap = new Map<string, string>();
      
      // Check for React component naming conventions
      const moduleEntries = Object.entries(import.meta.glob('/src/**/*.tsx', { eager: true }));
      
      for (const [path, module] of moduleEntries) {
        const filename = path.split('/').pop() || '';
        const filenameWithoutExt = filename.replace(/\.tsx$/, '');
        
        // Store lowercase path for case-sensitivity checking
        const lowercasePath = path.toLowerCase();
        
        if (importMap.has(lowercasePath)) {
          console.error(
            `[NAMING ERROR] Case sensitivity issue detected: Both '${path}' and '${importMap.get(lowercasePath)}' exist. ` +
            `This will cause build failures on case-sensitive file systems.`
          );
        } else {
          importMap.set(lowercasePath, path);
        }
        
        // Check if component filename is PascalCase
        if (filename.match(/\.tsx$/) && !/^[A-Z][a-zA-Z0-9]*\.tsx$/.test(filename)) {
          console.warn(
            `[NAMING WARNING] Component file '${filename}' should use PascalCase. ` +
            `Rename to '${filenameWithoutExt.charAt(0).toUpperCase() + filenameWithoutExt.slice(1)}.tsx'`
          );
        }
        
        // Check if file exports match filename
        const exports = Object.keys(module as Record<string, unknown>);
        
        if (exports.length > 0 && 
            !exports.includes(filenameWithoutExt) && 
            !exports.includes('default')) {
          console.warn(
            `[NAMING WARNING] File '${filename}' should export a component named '${filenameWithoutExt}' ` +
            `or use a default export. Found exports: ${exports.join(', ')}`
          );
        }
      }
      
      console.log('[NAMING CHECK] Naming convention check completed. See warnings above if any issues were found.');
    } catch (error) {
      console.error('[NAMING CHECK] Error checking naming conventions:', error);
    }
  }
}

/**
 * Initialize naming issue detection
 */
export function initNamingIssueDetection(): void {
  if (process.env.NODE_ENV !== 'production') {
    // Delay execution to ensure modules are loaded
    setTimeout(detectNamingIssues, 1000);
  }
}
