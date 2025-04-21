
/**
 * Vite plugin to strip debug/dev logs in production builds
 */

function createStripLogsPlugin(options = {}) {
  const {
    include = ['debug', 'dev']
  } = options;
  
  return {
    name: 'strip-logger-calls',
    transform(code, id) {
      // Only transform JS/TS files
      if (!/\.(js|ts|jsx|tsx)$/.test(id)) {
        return null;
      }
      
      // Skip node_modules
      if (/node_modules/.test(id)) {
        return null;
      }
      
      let modified = code;
      
      // Replace logger.X calls with empty statements for each included level
      include.forEach(level => {
        // Match both logger.level and logger.log('level') patterns
        const directCall = new RegExp(`logger\\.${level}\\([^)]*\\);?`, 'g');
        const logCall = new RegExp(`logger\\.log\\(['"']${level}['"'][^)]*\\);?`, 'g');
        
        modified = modified
          .replace(directCall, '/* stripped */')
          .replace(logCall, '/* stripped */');
      });
      
      if (modified !== code) {
        return {
          code: modified,
          map: null
        };
      }
      
      return null;
    }
  };
}

export default createStripLogsPlugin;
