
/**
 * File System Access API utilities
 * @module utils/fileSystem/fileSystemAccess
 */

/**
 * Check if the File System Access API is available
 * @returns True if File System Access API is available
 */
export function isFileSystemAccessSupported(): boolean {
  return 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
}

/**
 * Open a file using the File System Access API
 * @param options Options for opening files
 * @returns File handle and file content
 */
export async function openFile(options?: {
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}) {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser');
  }

  try {
    const [fileHandle] = await window.showOpenFilePicker({
      multiple: false,
      types: options?.types || [
        {
          description: 'All Files',
          accept: {
            '*/*': ['*']
          }
        }
      ]
    });

    const file = await fileHandle.getFile();
    const content = await file.text();

    return {
      fileHandle,
      file,
      content,
      name: file.name
    };
  } catch (error) {
    // User cancelled or other error
    if ((error as Error).name !== 'AbortError') {
      console.error('Error opening file:', error);
    }
    throw error;
  }
}

/**
 * Save a file using the File System Access API
 * @param content Content to save
 * @param options Options for saving the file
 * @returns File handle
 */
export async function saveFile(content: string, options?: {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}) {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser');
  }

  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: options?.suggestedName || 'untitled.txt',
      types: options?.types || [
        {
          description: 'Text Files',
          accept: {
            'text/plain': ['.txt']
          }
        }
      ]
    });

    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();

    return fileHandle;
  } catch (error) {
    // User cancelled or other error
    if ((error as Error).name !== 'AbortError') {
      console.error('Error saving file:', error);
    }
    throw error;
  }
}

/**
 * Open a directory using the File System Access API
 * @returns Directory handle
 */
export async function openDirectory() {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser');
  }

  try {
    const directoryHandle = await window.showDirectoryPicker();
    return directoryHandle;
  } catch (error) {
    // User cancelled or other error
    if ((error as Error).name !== 'AbortError') {
      console.error('Error opening directory:', error);
    }
    throw error;
  }
}

/**
 * Save a file to a specific directory
 * @param directoryHandle Directory handle to save to
 * @param filename Filename to save as
 * @param content Content to save
 * @returns File handle
 */
export async function saveFileToDirectory(directoryHandle: FileSystemDirectoryHandle, filename: string, content: string) {
  try {
    const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return fileHandle;
  } catch (error) {
    console.error('Error saving file to directory:', error);
    throw error;
  }
}
