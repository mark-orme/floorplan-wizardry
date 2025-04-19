
/**
 * SecureFileUpload Component
 * File upload component with built-in security validations
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createSecureFileUploadHandler, sanitizeFileName } from '@/utils/security/FileSecurityUtils';

interface SecureFileUploadProps {
  onValidFile: (file: File, sanitizedFileName: string) => void;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  maxSizeBytes?: number;
  label?: string;
  className?: string;
  buttonClassName?: string;
  buttonText?: string;
  multiple?: boolean;
  fileInfoClassName?: string;
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onValidFile,
  allowedTypes,
  allowedExtensions,
  maxSizeBytes,
  label = 'Upload File',
  className = '',
  buttonClassName = '',
  buttonText = 'Select File',
  multiple = false,
  fileInfoClassName = ''
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleInvalidFile = (error: string) => {
    toast.error(error);
  };
  
  const handleChange = createSecureFileUploadHandler(
    (file, sanitizedFileName) => {
      setSelectedFiles(prev => [...prev, file]);
      onValidFile(file, sanitizedFileName);
    },
    handleInvalidFile,
    {
      allowedTypes,
      allowedExtensions,
      maxSizeBytes,
      validateContent: true
    }
  );
  
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className={className}>
      {label && <p className="text-sm font-medium mb-2">{label}</p>}
      
      <div className="flex flex-col gap-3">
        <Button 
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className={buttonClassName}
        >
          {buttonText}
        </Button>
        
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          multiple={multiple}
          className="hidden"
          accept={allowedTypes?.join(',') || allowedExtensions?.map(ext => `.${ext}`).join(',')}
        />
        
        {selectedFiles.length > 0 && (
          <div className={`mt-2 ${fileInfoClassName}`}>
            <p className="text-sm font-medium">Selected Files:</p>
            <ul className="text-sm text-gray-500 mt-1">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span>{sanitizeFileName(file.name)}</span>
                  <span>({formatFileSize(file.size)})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
