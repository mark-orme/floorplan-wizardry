
/**
 * Log Migration Helper Utility
 * Helps identify and migrate raw console.log statements to the structured logger
 * 
 * Usage (in development console):
 * __logMigration.scanConsoleUsage() - Scan for direct console usage
 * __logMigration.generateMigrationPlan() - Get suggested replacements
 */

// Track overridden console methods
const originalConsoleMethods = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug
};

// Store console usage data
interface ConsoleUsage {
  method: 'log' | 'info' | 'warn' | 'error' | 'debug';
  args: any[];
  stack: string;
  timestamp: Date;
  file?: string;
  line?: number;
  suggestedReplacement?: string;
}

const consoleUsageData: ConsoleUsage[] = [];

/**
 * Extract filename and line number from stack trace
 */
function extractSourceInfo(stack: string): { file?: string; line?: number } {
  // Try to extract filename and line number from stack trace
  const stackLines = stack.split('\n');
  const callerLine = stackLines.find(line => 
    line.includes('.ts:') || 
    line.includes('.tsx:') || 
    line.includes('.js:')
  );
  
  if (!callerLine) return {};
  
  const fileMatch = callerLine.match(/\/([^\/]+\.(ts|tsx|js))\:(\d+)\:(\d+)/);
  if (fileMatch) {
    return {
      file: fileMatch[1],
      line: parseInt(fileMatch[3], 10)
    };
  }
  
  return {};
}

/**
 * Generate a suggested logger replacement
 */
function generateLoggerReplacement(usage: ConsoleUsage): string {
  if (!usage.file) return '';
  
  const module = usage.file.replace(/\.(ts|tsx|js)$/, '').toLowerCase();
  let namespace = 'app';
  
  // Try to determine appropriate namespace
  if (module.includes('grid')) namespace = 'grid';
  else if (module.includes('canvas')) namespace = 'canvas';
  else if (module.includes('line') || module.includes('tool')) namespace = 'tools';
  
  const methodMap: Record<string, string> = {
    'log': 'info',
    'info': 'info',
    'warn': 'warn',
    'error': 'error',
    'debug': 'debug'
  };
  
  const logMethod = methodMap[usage.method] || 'info';
  
  // Simple replacement for string-only logs
  if (usage.args.length === 1 && typeof usage.args[0] === 'string') {
    return `logger.${logMethod}('${usage.args[0].replace(/'/g, "\\'")}');`;
  }
  
  // Handle message + data
  if (usage.args.length > 1 && typeof usage.args[0] === 'string') {
    return `logger.${logMethod}('${usage.args[0].replace(/'/g, "\\'")}', ${JSON.stringify(usage.args.slice(1))});`;
  }
  
  // Default case
  return `logger.${logMethod}('Log message', ${JSON.stringify(usage.args)});`;
}

/**
 * Override console methods to track usage
 */
function installConsoleTracker() {
  // Override console.log
  console.log = (...args: any[]) => {
    const stack = new Error().stack || '';
    const sourceInfo = extractSourceInfo(stack);
    
    consoleUsageData.push({
      method: 'log',
      args,
      stack,
      timestamp: new Date(),
      ...sourceInfo
    });
    
    // Call original method
    originalConsoleMethods.log(...args);
  };
  
  // Similarly override other methods
  console.info = (...args: any[]) => {
    const stack = new Error().stack || '';
    const sourceInfo = extractSourceInfo(stack);
    
    consoleUsageData.push({
      method: 'info',
      args,
      stack,
      timestamp: new Date(),
      ...sourceInfo
    });
    
    originalConsoleMethods.info(...args);
  };
  
  console.warn = (...args: any[]) => {
    const stack = new Error().stack || '';
    const sourceInfo = extractSourceInfo(stack);
    
    consoleUsageData.push({
      method: 'warn',
      args,
      stack,
      timestamp: new Date(),
      ...sourceInfo
    });
    
    originalConsoleMethods.warn(...args);
  };
  
  console.error = (...args: any[]) => {
    const stack = new Error().stack || '';
    const sourceInfo = extractSourceInfo(stack);
    
    consoleUsageData.push({
      method: 'error',
      args,
      stack,
      timestamp: new Date(),
      ...sourceInfo
    });
    
    originalConsoleMethods.error(...args);
  };
  
  console.debug = (...args: any[]) => {
    const stack = new Error().stack || '';
    const sourceInfo = extractSourceInfo(stack);
    
    consoleUsageData.push({
      method: 'debug',
      args,
      stack,
      timestamp: new Date(),
      ...sourceInfo
    });
    
    originalConsoleMethods.debug(...args);
  };
}

/**
 * Restore original console methods
 */
function restoreConsoleMethods() {
  console.log = originalConsoleMethods.log;
  console.info = originalConsoleMethods.info;
  console.warn = originalConsoleMethods.warn;
  console.error = originalConsoleMethods.error;
  console.debug = originalConsoleMethods.debug;
}

/**
 * Scan for console usage
 */
function scanConsoleUsage(durationMs = 5000) {
  consoleUsageData.length = 0; // Clear previous data
  installConsoleTracker();
  
  console.log('[LogMigrationHelper] Scanning for console usage for', durationMs, 'ms');
  
  setTimeout(() => {
    restoreConsoleMethods();
    console.log(`[LogMigrationHelper] Scan complete. Found ${consoleUsageData.length} console usages.`);
  }, durationMs);
  
  return consoleUsageData;
}

/**
 * Generate migration plan
 */
function generateMigrationPlan() {
  // Process data and add suggested replacements
  const processedData = consoleUsageData.map(usage => {
    return {
      ...usage,
      suggestedReplacement: generateLoggerReplacement(usage)
    };
  });
  
  // Group by file
  const byFile: Record<string, ConsoleUsage[]> = {};
  processedData.forEach(usage => {
    if (!usage.file) return;
    
    if (!byFile[usage.file]) {
      byFile[usage.file] = [];
    }
    byFile[usage.file].push(usage);
  });
  
  // Create report
  console.log('[LogMigrationHelper] Migration Plan:');
  Object.entries(byFile).forEach(([file, usages]) => {
    console.group(`File: ${file} (${usages.length} usages)`);
    usages.forEach(usage => {
      console.log(
        `Line ${usage.line}: console.${usage.method}(...) → ${usage.suggestedReplacement}`
      );
    });
    console.groupEnd();
  });
  
  return { byFile, allUsages: processedData };
}

// Expose to dev console
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__logMigration = {
    scanConsoleUsage,
    generateMigrationPlan,
    getUsageData: () => consoleUsageData,
    installTracker: installConsoleTracker,
    restore: restoreConsoleMethods
  };
}

export default {
  scanConsoleUsage,
  generateMigrationPlan,
  getUsageData: () => consoleUsageData
};
