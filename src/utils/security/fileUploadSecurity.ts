
/**
 * File Upload Security Utilities
 * Provides validation and sanitization for file uploads
 * @module utils/security/fileUploadSecurity
 */

export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[]; // MIME types
  allowedExtensions?: string[];
  validateContent?: boolean; // Whether to check file content signature
  maxFileNameLength?: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFileName?: string;
}

// Default file validation options
export const DEFAULT_VALIDATION_OPTIONS: FileValidationOptions = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'text/plain', 'text/csv'
  ],
  allowedExtensions: [
    'jpg', 'jpeg', 'png', 'gif', 'webp',
    'pdf',
    'docx', 'xlsx',
    'txt', 'csv'
  ],
  validateContent: true,
  maxFileNameLength: 255
};

/**
 * Validate a file against security constraints
 * @param file File to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = DEFAULT_VALIDATION_OPTIONS
): FileValidationResult {
  const opts = { ...DEFAULT_VALIDATION_OPTIONS, ...options };
  
  // Check file size
  if (opts.maxSizeBytes && file.size > opts.maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${opts.maxSizeBytes / 1024 / 1024}MB`
    };
  }
  
  // Check MIME type
  if (opts.allowedTypes && opts.allowedTypes.length > 0) {
    if (!opts.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${opts.allowedTypes.join(', ')}`
      };
    }
  }
  
  // Check file extension
  if (opts.allowedExtensions && opts.allowedExtensions.length > 0) {
    const fileName = file.name.toLowerCase();
    const extension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
    
    if (!opts.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension .${extension} is not allowed. Allowed extensions: ${opts.allowedExtensions.join(', ')}`
      };
    }
  }
  
  // Sanitize file name for security
  const sanitizedFileName = sanitizeFileName(file.name, opts.maxFileNameLength || 255);
  
  return {
    valid: true,
    sanitizedFileName
  };
}

/**
 * Sanitize a filename to remove potentially malicious characters
 * @param fileName Original filename
 * @param maxLength Maximum length
 * @returns Sanitized filename
 */
export function sanitizeFileName(fileName: string, maxLength: number = 255): string {
  // Remove path traversal characters and other potentially dangerous patterns
  let sanitized = fileName
    .replace(/[/\\?%*:|"<>]/g, '-') // Remove characters not allowed in filenames
    .replace(/\.\./g, '-') // Remove potential path traversal
    .trim();
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    const extension = sanitized.slice(((sanitized.lastIndexOf(".") - 1) >>> 0) + 2);
    const nameWithoutExtension = sanitized.slice(0, sanitized.lastIndexOf("."));
    const truncatedName = nameWithoutExtension.slice(0, maxLength - extension.length - 1);
    sanitized = `${truncatedName}.${extension}`;
  }
  
  return sanitized;
}

/**
 * Create a file upload handler with security validation
 * @param onValidFile Handler for valid files
 * @param onInvalidFile Handler for invalid files
 * @param options Validation options
 * @returns File change handler function
 */
export function createSecureFileUploadHandler(
  onValidFile: (file: File, sanitizedFileName: string) => void,
  onInvalidFile: (error: string) => void,
  options: FileValidationOptions = DEFAULT_VALIDATION_OPTIONS
): (event: React.ChangeEvent<HTMLInputElement>) => void {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    // Validate each file
    Array.from(files).forEach(file => {
      const result = validateFile(file, options);
      
      if (result.valid && result.sanitizedFileName) {
        onValidFile(file, result.sanitizedFileName);
      } else if (!result.valid && result.error) {
        onInvalidFile(result.error);
      }
    });
    
    // Reset input to allow uploading the same file again
    event.target.value = '';
  };
}

/**
 * Check if a string matches common executable extensions that should be blocked
 * @param fileName Filename to check
 * @returns Whether the file has a potentially dangerous extension
 */
export function hasDangerousExtension(fileName: string): boolean {
  const dangerousExtensions = [
    'exe', 'dll', 'js', 'jsp', 'php', 'phtml', 'pl', 'py', 'rb', 'sh', 'bat', 'cmd', 'vbs', 'vbe', 'jse', 
    'wsf', 'wsh', 'msi', 'application', 'gadget', 'msp', 'com', 'hta', 'cpl', 'msc', 'jar', 'scr'
  ];
  
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return dangerousExtensions.includes(extension);
}
