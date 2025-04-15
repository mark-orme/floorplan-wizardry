
/**
 * File Security Utilities
 * Provides secure file handling functions
 */

/**
 * Sanitize a filename to prevent path traversal and other attacks
 * @param fileName File name to sanitize
 * @returns Sanitized file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') return '';
  // Remove path traversal sequences and potentially dangerous characters
  return fileName
    .replace(/[/\\?%*:|"<>]/g, '_') // Replace unsafe characters with underscore
    .replace(/\.{2,}/g, '.'); // Replace multiple dots with a single dot
}

/**
 * Create a secure file upload handler with validation
 * @param onValidFile Callback for valid files
 * @param onInvalidFile Callback for invalid files
 * @param options Validation options
 * @returns File input change handler
 */
export function createSecureFileUploadHandler(
  onValidFile: (file: File, sanitizedName: string) => void,
  onInvalidFile: (error: string) => void,
  options: {
    allowedTypes?: string[];
    allowedExtensions?: string[];
    maxSizeBytes?: number;
    validateContent?: boolean;
  } = {}
): (e: React.ChangeEvent<HTMLInputElement>) => void {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { 
      allowedTypes = [],
      allowedExtensions = [],
      maxSizeBytes = 5 * 1024 * 1024, // 5MB default
      validateContent = true
    } = options;
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxSizeBytes) {
        onInvalidFile(`File too large: ${file.name}`);
        return;
      }
      
      // Check file type if specified
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        onInvalidFile(`Invalid file type: ${file.type}`);
        return;
      }
      
      // Check extension if specified
      if (allowedExtensions.length > 0) {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        if (!allowedExtensions.includes(extension)) {
          onInvalidFile(`Invalid file extension: ${extension}`);
          return;
        }
      }
      
      // Validate file name
      const sanitizedFileName = sanitizeFileName(file.name);
      
      // Content validation would normally go here (e.g. checking for malicious content)
      // For now, we'll accept the file if we've made it this far
      onValidFile(file, sanitizedFileName);
    });
  };
}
