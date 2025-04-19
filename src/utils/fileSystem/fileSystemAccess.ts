
/**
 * File System Access API utilities
 * Modern browser API for direct file access
 * @module utils/fileSystem/fileSystemAccess
 */
import logger from '@/utils/logger';

// Type definitions
export type FileSystemOptions = {
  multiple?: boolean;
  excludeAcceptAllOption?: boolean;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
  startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
};

export type SaveFileOptions = {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
};

/**
 * Check if File System Access API is supported
 */
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window;
}

/**
 * Open file(s) using the File System Access API
 * 
 * @param options Options for file picker
 * @returns Promise resolving to array of files
 */
export async function openFilesWithPicker(options?: FileSystemOptions): Promise<File[]> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser');
  }
  
  try {
    // Set default options for floor plans
    const pickerOptions: FileSystemOptions = {
      multiple: false,
      types: [
        {
          description: 'Floor Plan Files',
          accept: {
            'application/json': ['.floorplan', '.fplan', '.json'],
            'image/svg+xml': ['.svg']
          }
        }
      ],
      ...options
    };
    
    // @ts-ignore - TypeScript doesn't have types for the File System Access API yet
    const fileHandles = await window.showOpenFilePicker(pickerOptions);
    
    // Convert file handles to actual files
    const files = await Promise.all(
      fileHandles.map(async (handle: any) => {
        const file = await handle.getFile();
        // Store handle on file for later use
        (file as any).handle = handle;
        return file;
      })
    );
    
    return files;
  } catch (error) {
    // User cancelled or other error
    if ((error as any)?.name === 'AbortError') {
      // User cancelled dialog, not a real error
      return [];
    }
    
    logger.error('Error opening files with picker', { error });
    throw error;
  }
}

/**
 * Save a file using the File System Access API
 * 
 * @param data Data to save
 * @param options Save options
 * @returns Promise resolving to boolean success
 */
export async function saveFileWithPicker(
  data: string | Blob,
  options?: SaveFileOptions
): Promise<boolean> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser');
  }
  
  try {
    // Set default options
    const saveOptions: SaveFileOptions = {
      suggestedName: 'floor-plan.floorplan',
      types: [
        {
          description: 'Floor Plan Files',
          accept: {
            'application/json': ['.floorplan', '.fplan']
          }
        }
      ],
      ...options
    };
    
    // @ts-ignore - TypeScript doesn't have types for the File System Access API yet
    const fileHandle = await window.showSaveFilePicker(saveOptions);
    
    // Create writable stream
    const writable = await fileHandle.createWritable();
    
    // Write the data
    await writable.write(data);
    
    // Close the file
    await writable.close();
    
    return true;
  } catch (error) {
    // User cancelled or other error
    if ((error as any)?.name === 'AbortError') {
      // User cancelled dialog, not a real error
      return false;
    }
    
    logger.error('Error saving file with picker', { error });
    throw error;
  }
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Share content using the Web Share API
 * 
 * @param shareData Data to share
 * @returns Promise resolving to boolean success
 */
export async function shareContent(shareData: {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}): Promise<boolean> {
  if (!isWebShareSupported()) {
    throw new Error('Web Share API is not supported in this browser');
  }
  
  try {
    await navigator.share(shareData);
    return true;
  } catch (error) {
    // User cancelled or other error
    if ((error as any)?.name === 'AbortError') {
      return false;
    }
    
    logger.error('Error sharing content', { error });
    throw error;
  }
}

/**
 * Export a floor plan to a file using fallback method for older browsers
 * 
 * @param data Data to export
 * @param filename Suggested filename
 */
export function exportFallback(data: string | Blob, filename: string): void {
  // Create a blob from the data if it's a string
  const blob = typeof data === 'string' 
    ? new Blob([data], { type: 'application/json' }) 
    : data;
  
  // Create object URL
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
