
/**
 * Utility to help migrate from console.* calls to structured logger
 * Identifies raw console calls and provides replacement suggestions
 */

interface ConsoleUsage {
  method: string;
  count: number;
  stack: string[];
  messages: string[];
}

class LogMigrationHelper {
  private usages: Record<string, ConsoleUsage> = {};
  private originalConsoleMethods: Record<string, Function> = {};
  private isScanning = false;
  
  /**
   * Start scanning for console usage
   */
  scanConsoleUsage(): void {
    if (this.isScanning) {
      console.warn("Already scanning for console usage");
      return;
    }
    
    this.isScanning = true;
    this.usages = {};
    
    // Store original methods
    const methods = ['log', 'debug', 'info', 'warn', 'error'];
    methods.forEach(method => {
      this.originalConsoleMethods[method] = console[method];
      
      // Override method to track usage
      console[method] = (...args: any[]) => {
        // Call original method
        this.originalConsoleMethods[method].apply(console, args);
        
        // Capture stack trace
        const error = new Error();
        const stack = error.stack || '';
        const stackLines = stack.split('\n').slice(2); // Skip Error and this function
        const caller = stackLines[0]?.trim() || 'unknown';
        
        // Store usage data
        if (!this.usages[caller]) {
          this.usages[caller] = {
            method,
            count: 0,
            stack: stackLines,
            messages: []
          };
        }
        
        this.usages[caller].count++;
        this.usages[caller].messages.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '));
      };
    });
    
    console.info("Console usage scanning started. Interact with your app to capture logs.");
  }
  
  /**
   * Stop scanning and restore original console methods
   */
  stopScanning(): void {
    if (!this.isScanning) {
      return;
    }
    
    // Restore original methods
    Object.keys(this.originalConsoleMethods).forEach(method => {
      console[method] = this.originalConsoleMethods[method];
    });
    
    this.isScanning = false;
    console.info("Console usage scanning stopped.");
  }
  
  /**
   * Generate a migration plan for console calls
   */
  generateMigrationPlan(): void {
    if (Object.keys(this.usages).length === 0) {
      console.info("No console usage detected. Run scanConsoleUsage() first and interact with your app.");
      return;
    }
    
    console.group("Console Usage Migration Plan");
    
    Object.entries(this.usages).forEach(([caller, usage]) => {
      console.groupCollapsed(`${caller} (${usage.count} calls to console.${usage.method})`);
      
      console.log("Sample messages:", usage.messages.slice(0, 3));
      console.log("Stack trace:", usage.stack.slice(0, 3));
      
      // Suggest replacement
      const namespace = this.extractNamespace(caller);
      const methodMap: Record<string, string> = {
        'log': 'info',
        'debug': 'debug',
        'info': 'info',
        'warn': 'warn', 
        'error': 'error'
      };
      
      const suggestedMethod = methodMap[usage.method] || 'info';
      const messageSample = usage.messages[0] || '"message"';
      
      console.log("Suggested replacement:");
      console.log(`import logger from '@/utils/logger';`);
      console.log(`logger.${suggestedMethod}(${JSON.stringify(messageSample)}, { /* contextual data */ });`);
      
      // For component-specific logs
      if (namespace) {
        console.log("Or with namespace:");
        console.log(`const ${namespace}Logger = logger.forNamespace('${namespace}');`);
        console.log(`${namespace}Logger.${suggestedMethod}(${JSON.stringify(messageSample)}, { /* contextual data */ });`);
      }
      
      console.groupEnd();
    });
    
    console.groupEnd();
  }
  
  /**
   * Extract a namespace from a caller string
   */
  private extractNamespace(caller: string): string | null {
    // Extract component or module name from stack trace
    const match = caller.match(/at\s+(\w+)\s+\(/);
    if (match && match[1]) {
      return match[1].charAt(0).toLowerCase() + match[1].slice(1);
    }
    
    // Extract filename if no component name
    const fileMatch = caller.match(/\(([^:]+)\./);
    if (fileMatch && fileMatch[1]) {
      const parts = fileMatch[1].split('/');
      const filename = parts[parts.length - 1];
      return filename.charAt(0).toLowerCase() + filename.slice(1).replace(/\.[jt]sx?$/, '');
    }
    
    return null;
  }
}

// Create and export singleton
const logMigration = new LogMigrationHelper();

// Expose to window in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__logMigration = logMigration;
}

export default logMigration;
