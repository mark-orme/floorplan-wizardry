
/**
 * Logger configuration
 * Provides log level settings and utilities
 */

// Log levels with numeric values for comparison
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

// Default namespace configuration
type NamespaceConfig = {
  level: LogLevel;
  enabled: boolean;
};

// Store namespace configurations
const namespaceConfig: Record<string, NamespaceConfig> = {};

// Default log level - can be overridden by environment
let defaultLevel = import.meta.env.PROD 
  ? LogLevel.ERROR 
  : LogLevel.DEBUG;

/**
 * Set the default log level
 * @param level Log level to set as default
 */
export function setDefaultLogLevel(level: LogLevel): void {
  defaultLevel = level;
}

/**
 * Configure logging for a specific namespace
 * @param namespace Namespace to configure
 * @param level Log level for the namespace
 * @param enabled Whether the namespace is enabled
 */
export function configureNamespace(
  namespace: string, 
  level: LogLevel = defaultLevel,
  enabled: boolean = true
): void {
  namespaceConfig[namespace] = { level, enabled };
}

/**
 * Check if a log level is enabled for a namespace
 * @param namespace Namespace to check
 * @param level Log level to check
 * @returns Whether the log level is enabled
 */
export function isLevelEnabled(namespace: string, level: LogLevel): boolean {
  // If namespace is not configured, use default settings
  if (!namespaceConfig[namespace]) {
    // Auto-configure with default settings
    configureNamespace(namespace);
  }
  
  const config = namespaceConfig[namespace];
  
  // If namespace is disabled, no logs
  if (!config.enabled) {
    return false;
  }
  
  // If in development, check local storage for debug flags
  if (import.meta.env.DEV) {
    try {
      // Check for global debug flag
      const debugAll = localStorage.getItem('debug-all') === 'true';
      if (debugAll) {
        return true;
      }
      
      // Check for namespace-specific debug flag
      const debugNamespace = localStorage.getItem(`debug-${namespace}`);
      if (debugNamespace) {
        const debugLevel = parseInt(debugNamespace, 10);
        if (!isNaN(debugLevel)) {
          return level >= debugLevel;
        }
        return debugNamespace === 'true';
      }
    } catch (e) {
      // Ignore localStorage errors (e.g., in SSR or when disabled)
    }
  }
  
  // Check level against namespace configuration
  return level >= config.level;
}

/**
 * Enable all logging for a namespace
 * @param namespace Namespace to enable
 */
export function enableNamespace(namespace: string): void {
  if (namespaceConfig[namespace]) {
    namespaceConfig[namespace].enabled = true;
  } else {
    configureNamespace(namespace, defaultLevel, true);
  }
}

/**
 * Disable all logging for a namespace
 * @param namespace Namespace to disable
 */
export function disableNamespace(namespace: string): void {
  if (namespaceConfig[namespace]) {
    namespaceConfig[namespace].enabled = false;
  } else {
    configureNamespace(namespace, defaultLevel, false);
  }
}

// Initialize common namespaces
function initializeDefaultNamespaces(): void {
  const namespaces = [
    'app', 'canvas', 'drawing', 'grid', 'ui', 'storage',
    'performance', 'network', 'auth', 'i18n'
  ];
  
  namespaces.forEach(ns => configureNamespace(ns));
}

// Initialize on load
initializeDefaultNamespaces();

// Add debug helper functions to window in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).__logger = {
    enable: (ns: string) => enableNamespace(ns),
    disable: (ns: string) => disableNamespace(ns),
    setLevel: (ns: string, level: LogLevel) => {
      configureNamespace(ns, level);
    },
    listConfig: () => ({ ...namespaceConfig }),
    enableAll: () => {
      localStorage.setItem('debug-all', 'true');
      console.log('Enabled all logging');
    },
    disableAll: () => {
      localStorage.removeItem('debug-all');
      console.log('Disabled all logging');
    }
  };
}
