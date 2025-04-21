
/**
 * Application Initialization
 * Initialize all required features on app startup
 */
import { initializeAllSecurity } from './security';
import logger from './logger';

/**
 * Initialize the application
 * @returns Promise resolving when initialization is complete
 */
export async function initializeApp(): Promise<void> {
  try {
    logger.info('Initializing application...');
    
    // Initialize security features
    initializeAllSecurity();
    
    // Initialize WASM modules if needed
    try {
      const { initWasm } = await import('./wasm');
      await initWasm();
    } catch (error) {
      logger.warn('WASM initialization failed, using fallback implementations', { error });
    }
    
    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize application', { error });
    throw error;
  }
}
