
/**
 * Rollup/Vite plugin to strip debug logs in production
 * 
 * Usage in vite.config.js:
 * import stripLogsPlugin from './src/utils/logger/stripLogsPlugin.js';
 * 
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     stripLogsPlugin({ include: ['debug', 'dev', 'info'] })
 *   ]
 * });
 */

/**
 * Plugin to strip logger calls from production builds
 * @param {Object} options - Plugin options
 * @param {string[]} options.include - Logger methods to strip (e.g., ['debug', 'dev'])
 * @returns {Object} Rollup plugin
 */
export default function stripLogsPlugin(options = { include: ['debug', 'dev'] }) {
  const methodsToStrip = options.include || ['debug', 'dev'];
  
  return {
    name: 'strip-logger-calls',
    transform(code, id) {
      // Only process TypeScript/JavaScript files
      if (!id.match(/\.[jt]sx?$/)) return null;
      
      // Skip node_modules
      if (id.includes('node_modules')) return null;
      
      let modified = code;
      
      // Strip logger method calls
      methodsToStrip.forEach(method => {
        // Match both logger.debug() and namespaced loggers
        const regexes = [
          new RegExp(`logger\\.${method}\\([^)]*\\);?`, 'g'),
          new RegExp(`\\w+Logger\\.${method}\\([^)]*\\);?`, 'g')
        ];
        
        regexes.forEach(regex => {
          modified = modified.replace(regex, '/* stripped */');
        });
      });
      
      return {
        code: modified,
        map: null
      };
    }
  };
}
