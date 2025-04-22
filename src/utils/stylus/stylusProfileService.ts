
import { StylusProfile, DEFAULT_STYLUS_PROFILE } from '@/types/core/StylusProfile';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// IndexedDB database details
const DB_NAME = 'stylus_profiles_db';
const STORE_NAME = 'profiles';
const DB_VERSION = 1;

/**
 * Open the IndexedDB database for stylus profiles
 */
async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening stylus profiles database:', event);
      reject(new Error('Failed to open stylus profiles database'));
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('lastCalibrated', 'lastCalibrated', { unique: false });
        
        // Add default profile
        store.add({
          ...DEFAULT_STYLUS_PROFILE,
          lastCalibrated: new Date().toISOString()
        });
        
        console.info('Created stylus profiles store');
      }
    };
  });
}

/**
 * Get all saved stylus profiles
 * @returns Array of stylus profiles
 */
export async function getAllProfiles(): Promise<StylusProfile[]> {
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const profiles = request.result.map(profile => ({
          ...profile,
          lastCalibrated: new Date(profile.lastCalibrated)
        }));
        resolve(profiles);
      };
      
      request.onerror = (event) => {
        console.error('Error fetching stylus profiles:', event);
        reject(new Error('Failed to fetch stylus profiles'));
      };
    });
  } catch (error) {
    console.error('Error in getAllProfiles:', error);
    return [DEFAULT_STYLUS_PROFILE];
  }
}

/**
 * Get a specific stylus profile by ID
 * @param id Profile ID to retrieve
 * @returns The stylus profile or default if not found
 */
export async function getProfileById(id: string): Promise<StylusProfile> {
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => {
        if (request.result) {
          const profile = {
            ...request.result,
            lastCalibrated: new Date(request.result.lastCalibrated)
          };
          resolve(profile);
        } else {
          resolve(DEFAULT_STYLUS_PROFILE);
        }
      };
      
      request.onerror = (event) => {
        console.error(`Error getting profile with ID ${id}:`, event);
        reject(new Error(`Failed to get profile with ID ${id}`));
      };
    });
  } catch (error) {
    console.error('Error in getProfileById:', error);
    return DEFAULT_STYLUS_PROFILE;
  }
}

/**
 * Save a stylus profile
 * @param profile Profile to save
 * @returns true if successful
 */
export async function saveProfile(profile: StylusProfile): Promise<boolean> {
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Ensure we have an ID and updated date
      const profileToSave = {
        ...profile,
        id: profile.id || uuidv4(),
        lastCalibrated: new Date().toISOString()
      };
      
      const request = store.put(profileToSave);
      
      request.onsuccess = () => {
        toast.success(`Profile "${profile.name}" saved`);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error saving stylus profile:', event);
        toast.error('Failed to save stylus profile');
        reject(new Error('Failed to save stylus profile'));
      };
    });
  } catch (error) {
    console.error('Error in saveProfile:', error);
    toast.error('Failed to save stylus profile');
    return false;
  }
}

/**
 * Delete a stylus profile
 * @param id Profile ID to delete
 * @returns true if successful
 */
export async function deleteProfile(id: string): Promise<boolean> {
  // Don't allow deleting the default profile
  if (id === 'default') {
    toast.error('Cannot delete the default profile');
    return false;
  }
  
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        toast.success('Profile deleted');
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error(`Error deleting profile with ID ${id}:`, event);
        toast.error('Failed to delete profile');
        reject(new Error(`Failed to delete profile with ID ${id}`));
      };
    });
  } catch (error) {
    console.error('Error in deleteProfile:', error);
    toast.error('Failed to delete profile');
    return false;
  }
}

/**
 * Get the active stylus profile
 * @returns The active profile or default if none set
 */
export async function getActiveProfile(): Promise<StylusProfile> {
  try {
    const activeProfileId = localStorage.getItem('activeProfileId') || 'default';
    return await getProfileById(activeProfileId);
  } catch (error) {
    console.error('Error getting active profile:', error);
    return DEFAULT_STYLUS_PROFILE;
  }
}

/**
 * Set the active stylus profile
 * @param id Profile ID to set as active
 */
export function setActiveProfile(id: string): void {
  localStorage.setItem('activeProfileId', id);
  toast.success('Active profile updated');
}
