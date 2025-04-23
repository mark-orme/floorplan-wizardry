
/**
 * File security utilities for secure file handling
 */

/**
 * Sanitize a filename to prevent path traversal and other security issues
 * @param filename Original filename
 * @returns Sanitized filename
 */
export function sanitizeFileName(filename: string): string {
  if (!filename) return '';
  
  // Remove any directory traversal sequences and control characters
  const sanitized = filename
    .replace(/[\/\\]/g, '_') // Replace slashes with underscores
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.\.+/g, '.'); // Replace multiple dots with a single dot
    
  return sanitized;
}

/**
 * Interface for file upload handler options
 */
interface FileSecurityOptions {
  allowedTypes?: string[];
  allowedExtensions?: string[];
  maxSizeBytes?: number;
  validateContent?: boolean;
}

/**
 * Create a secure file upload handler with validation
 * @param onValidFile Callback for valid files
 * @param onInvalidFile Callback for invalid files
 * @param options File validation options
 * @returns Event handler for file inputs
 */
export function createSecureFileUploadHandler(
  onValidFile: (file: File, sanitizedFileName: string) => void,
  onInvalidFile: (error: string) => void,
  options: FileSecurityOptions = {}
) {
  const {
    allowedTypes = [],
    allowedExtensions = [],
    maxSizeBytes = 10 * 1024 * 1024, // Default 10MB
    validateContent = true
  } = options;

  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const sanitizedFileName = sanitizeFileName(file.name);
      let isValid = true;
      let errorMessage = '';
      
      // Check file size
      if (maxSizeBytes > 0 && file.size > maxSizeBytes) {
        isValid = false;
        errorMessage = `File ${sanitizedFileName} exceeds the maximum allowed size of ${maxSizeBytes / 1024 / 1024}MB`;
      }
      
      // Check MIME type if specified
      if (isValid && allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        isValid = false;
        errorMessage = `File ${sanitizedFileName} has an unsupported file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`;
      }
      
      // Check file extension if specified
      if (isValid && allowedExtensions.length > 0) {
        const extension = sanitizedFileName.split('.').pop()?.toLowerCase() || '';
        if (!allowedExtensions.includes(extension)) {
          isValid = false;
          errorMessage = `File ${sanitizedFileName} has an unsupported extension: ${extension}. Allowed extensions: ${allowedExtensions.join(', ')}`;
        }
      }
      
      if (isValid) {
        onValidFile(file, sanitizedFileName);
      } else {
        onInvalidFile(errorMessage);
      }
    });
  };
}
