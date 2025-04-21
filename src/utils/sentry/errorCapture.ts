
interface CaptureErrorOptions {
  context?: Record<string, any>;
  tags?: Record<string, string>;
  level?: 'info' | 'warning' | 'error' | 'fatal';
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  showDialog?: boolean; // Changed from showReportDialog to showDialog
}

/**
 * Capture and report an error
 * @param error Error to capture
 * @param options Capture options
 */
export function captureException(error: Error, options?: CaptureErrorOptions) {
  // Log the error to console
  console.error('Error captured:', error);
  
  // Add additional context
  if (options?.context) {
    console.log('Error context:', options.context);
  }
  
  // Log tags
  if (options?.tags) {
    console.log('Error tags:', options.tags);
  }
  
  // Show error dialog if requested
  if (options?.showDialog) {
    // Show a dialog - changed from showReportDialog
    alert(`An error occurred: ${error.message}`);
  }
}
