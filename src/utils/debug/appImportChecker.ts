
/**
 * Runtime check for common App import issues
 * This will alert developers if they're using incorrect import paths
 */

export function checkAppImports(): void {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const modules = Object.keys(import.meta.glob('/src/*.tsx', { eager: true }));
      
      // Check for case variants of App.tsx
      const appVariants = modules.filter(m => 
        m.toLowerCase().includes('/app.tsx') || 
        m.toLowerCase().includes('/app.jsx')
      );
      
      if (appVariants.length > 1) {
        console.error(
          `[CRITICAL ERROR] Multiple App file variants detected: ${appVariants.join(', ')}. ` +
          `This will cause build errors. Keep only one version with proper PascalCase naming (App.tsx).`
        );
      }
      
      // Check if we have both app.ts and App.tsx
      const hasLowercaseApp = appVariants.some(m => m.includes('/app.'));
      const hasProperCaseApp = appVariants.some(m => m.includes('/App.'));
      
      if (hasLowercaseApp && hasProperCaseApp) {
        console.error(
          `[CRITICAL ERROR] Both lowercase 'app' and PascalCase 'App' files exist. ` +
          `This will cause build errors on case-sensitive file systems. Delete the lowercase version.`
        );
      }
      
      if (hasLowercaseApp && !hasProperCaseApp) {
        console.warn(
          `[NAMING WARNING] Found lowercase 'app' file but no PascalCase 'App' file. ` +
          `Consider renaming to 'App.tsx' for consistency with React conventions.`
        );
      }
      
      // Check imports in main.tsx
      const mainModules = Object.keys(import.meta.glob('/src/main.tsx', { eager: true }));
      
      if (mainModules.length > 0) {
        const mainModule = import.meta.glob('/src/main.tsx', { eager: true })[mainModules[0]];
        const mainContent = JSON.stringify(mainModule);
        
        if (mainContent.includes('./app') || mainContent.includes("./app'")) {
          console.error(
            `[IMPORT ERROR] main.tsx appears to import App with incorrect casing. ` +
            `Change import to 'import App from './App';' to prevent build errors.`
          );
        }
      }
    } catch (error) {
      console.error('[APP IMPORT CHECK] Error checking App import consistency:', error);
    }
  }
}

/**
 * Initialize the App import checker
 */
export function initAppImportChecker(): void {
  if (process.env.NODE_ENV !== 'production') {
    // Delay to ensure modules are loaded
    setTimeout(checkAppImports, 1000);
  }
}
