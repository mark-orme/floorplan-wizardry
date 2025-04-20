
import { 
  saveCanvasToIDB, 
  loadCanvasFromIDB, 
  clearSavedCanvas, 
  listSavedCanvasKeys 
} from './idbCanvasStore';
import { 
  generateEncryptionKey, 
  encryptData, 
  decryptData, 
  isEncryptionSupported 
} from '@/utils/security/dataEncryption';
import { toast } from 'sonner';

// Key used for encryption - in a production app, this would be derived from user auth
const ENCRYPTION_KEY_SALT = 'floor-plan-app-encryption-salt';
let globalEncryptionKey: CryptoKey | null = null;

/**
 * Initialize encryption by generating a key
 * @param passphrase Optional passphrase for more secure encryption
 * @returns Promise resolving to boolean indicating success
 */
export async function initializeEncryption(passphrase?: string): Promise<boolean> {
  try {
    if (!isEncryptionSupported()) {
      console.warn('Encryption is not supported in this browser');
      toast.warning('Secure storage is not available in this browser');
      return false;
    }

    const derivedPassphrase = passphrase || 
      localStorage.getItem('localDeviceId') || 
      'default-secure-' + navigator.userAgent;
    
    globalEncryptionKey = await generateEncryptionKey(derivedPassphrase + ENCRYPTION_KEY_SALT);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize encryption:', error);
    toast.error('Could not set up secure storage');
    return false;
  }
}

/**
 * Save encrypted canvas to IndexedDB
 * @param key Canvas identifier
 * @param canvasData Canvas data to store
 * @returns Promise resolving to boolean indicating success
 */
export async function saveEncryptedCanvas(key: string, canvasData: any): Promise<boolean> {
  try {
    // Initialize encryption if needed
    if (!globalEncryptionKey) {
      await initializeEncryption();
    }
    
    if (!globalEncryptionKey) {
      // Fall back to unencrypted storage if encryption setup fails
      console.warn('Falling back to unencrypted storage for:', key);
      return saveCanvasToIDB(key, canvasData);
    }
    
    // Encrypt the canvas data
    const encrypted = await encryptData(canvasData, globalEncryptionKey);
    
    // Store the encrypted data
    await saveCanvasToIDB(`enc-${key}`, {
      encrypted: true,
      data: encrypted
    });
    
    return true;
  } catch (error) {
    console.error('Error saving encrypted canvas:', error);
    
    // Attempt fallback to unencrypted storage
    try {
      console.warn('Falling back to unencrypted storage after encryption error');
      return saveCanvasToIDB(key, canvasData);
    } catch (fallbackError) {
      console.error('Fallback storage also failed:', fallbackError);
      return false;
    }
  }
}

/**
 * Load encrypted canvas from IndexedDB
 * @param key Canvas identifier
 * @returns Promise resolving to decrypted canvas data or null
 */
export async function loadEncryptedCanvas(key: string): Promise<any> {
  try {
    // Check for encrypted version first
    const encryptedData = await loadCanvasFromIDB(`enc-${key}`);
    
    if (encryptedData && encryptedData.encrypted) {
      // Initialize encryption if needed
      if (!globalEncryptionKey) {
        await initializeEncryption();
      }
      
      if (!globalEncryptionKey) {
        console.error('Cannot decrypt data without encryption key');
        toast.error('Cannot access secured data');
        return null;
      }
      
      // Decrypt the data
      return decryptData(encryptedData.data, globalEncryptionKey);
    }
    
    // Fallback to unencrypted data
    return loadCanvasFromIDB(key);
  } catch (error) {
    console.error('Error loading encrypted canvas:', error);
    
    // Try fallback to unencrypted
    try {
      console.warn('Attempting to load unencrypted version');
      return loadCanvasFromIDB(key);
    } catch (fallbackError) {
      console.error('Fallback loading also failed:', fallbackError);
      return null;
    }
  }
}

/**
 * Delete saved canvas
 * @param key Canvas identifier
 * @returns Promise resolving to boolean indicating success
 */
export async function clearEncryptedCanvas(key: string): Promise<boolean> {
  try {
    // Clear both encrypted and unencrypted versions
    await clearSavedCanvas(`enc-${key}`);
    await clearSavedCanvas(key);
    return true;
  } catch (error) {
    console.error('Error clearing canvas:', error);
    return false;
  }
}

/**
 * List all saved canvas keys (both encrypted and unencrypted)
 * @returns Promise resolving to array of canvas keys
 */
export async function listEncryptedCanvasKeys(): Promise<string[]> {
  try {
    const allKeys = await listSavedCanvasKeys();
    
    // Filter and normalize keys
    const normalizedKeys = new Set<string>();
    
    allKeys.forEach(key => {
      if (key.startsWith('enc-')) {
        normalizedKeys.add(key.substring(4)); // Remove 'enc-' prefix
      } else {
        normalizedKeys.add(key);
      }
    });
    
    return Array.from(normalizedKeys);
  } catch (error) {
    console.error('Error listing canvas keys:', error);
    return [];
  }
}
