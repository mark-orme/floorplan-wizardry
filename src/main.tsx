
/**
 * Application entry module
 * Re-exports from main modules
 * @module main
 */

// Set up Sentry for error reporting
export const setupSentry = () => {
  console.log('Setting up Sentry');
  // Sentry setup code would go here
};

// Initialize the application
export const initializeApp = () => {
  console.log('Initializing application');
  // App initialization code would go here
};

// Export functions
export { setupSentry, initializeApp };
