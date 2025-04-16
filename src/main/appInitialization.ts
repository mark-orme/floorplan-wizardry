
/**
 * Application initialization module
 * @module main/appInitialization
 */
import { QueryClient } from '@tanstack/react-query';

/**
 * Initialize global error handler
 */
export function setupGlobalErrorHandler(): void {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Prevent default error handling
    event.preventDefault();
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent default rejection handling
    event.preventDefault();
  });
}

/**
 * Initialize service worker if available
 */
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.info('ServiceWorker registration successful');
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
}

/**
 * Create query client for React Query
 * @returns Configured query client
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        gcTime: 1000 * 60 * 10, // 10 minutes
      }
    }
  });
}

/**
 * Initialize the application
 */
export function initializeApp(): void {
  // Configure global error handling
  setupGlobalErrorHandler();
  
  // Register service worker for offline support
  registerServiceWorker();
  
  console.info('Application initialized');
}
