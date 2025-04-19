
/**
 * Secret Manager
 * Utilities for handling API keys and secrets securely
 */
import logger from '@/utils/logger';
import { Security } from '@/utils/security';

interface Secret {
  name: string;
  value: string;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
}

// In-memory secret cache
const secretCache: Record<string, Secret> = {};

/**
 * Get a secret by name
 * @param name Secret name
 * @returns Secret value or null if not found
 */
export function getSecret(name: string): string | null {
  try {
    // Check if secret is in cache
    if (secretCache[name]) {
      // Update last used
      secretCache[name].lastUsed = new Date().toISOString();
      return secretCache[name].value;
    }
    
    // Try to get from sessionStorage (for current session only)
    // Note: In a production app, sensitive data should not be stored in localStorage
    const sessionSecret = sessionStorage.getItem(`secret_${name}`);
    if (sessionSecret) {
      try {
        const parsed = JSON.parse(sessionSecret);
        
        // Check if expired
        if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
          sessionStorage.removeItem(`secret_${name}`);
          return null;
        }
        
        // Cache and return
        secretCache[name] = {
          ...parsed,
          lastUsed: new Date().toISOString()
        };
        
        return parsed.value;
      } catch (e) {
        logger.error(`Error parsing secret ${name}:`, e);
        return null;
      }
    }
    
    // Not found
    return null;
  } catch (error) {
    logger.error(`Error getting secret ${name}:`, error);
    return null;
  }
}

/**
 * Store a secret securely
 * @param name Secret name
 * @param value Secret value
 * @param options Secret options
 * @returns Whether the operation was successful
 */
export function storeSecret(
  name: string,
  value: string,
  options: {
    expiresInMinutes?: number;
    sessionOnly?: boolean;
  } = {}
): boolean {
  try {
    // Generate expiration date if provided
    const expiresAt = options.expiresInMinutes
      ? new Date(Date.now() + options.expiresInMinutes * 60 * 1000).toISOString()
      : undefined;
    
    // Create secret object
    const secret: Secret = {
      name,
      value,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      expiresAt
    };
    
    // Store in cache
    secretCache[name] = secret;
    
    // Store in sessionStorage (for current session only)
    sessionStorage.setItem(`secret_${name}`, JSON.stringify(secret));
    
    return true;
  } catch (error) {
    logger.error(`Error storing secret ${name}:`, error);
    return false;
  }
}

/**
 * Delete a secret
 * @param name Secret name
 * @returns Whether the operation was successful
 */
export function deleteSecret(name: string): boolean {
  try {
    // Remove from cache
    delete secretCache[name];
    
    // Remove from sessionStorage
    sessionStorage.removeItem(`secret_${name}`);
    
    return true;
  } catch (error) {
    logger.error(`Error deleting secret ${name}:`, error);
    return false;
  }
}

/**
 * List all secret names (without values)
 * @returns Array of secret names
 */
export function listSecrets(): string[] {
  try {
    const secrets = new Set<string>();
    
    // Add from cache
    Object.keys(secretCache).forEach(name => {
      secrets.add(name);
    });
    
    // Add from sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('secret_')) {
        secrets.add(key.substring(7));
      }
    }
    
    return Array.from(secrets);
  } catch (error) {
    logger.error('Error listing secrets:', error);
    return [];
  }
}

/**
 * Rotate a secret (generate and store new value)
 * @param name Secret name
 * @param generator Function to generate new secret value
 * @param options Secret options
 * @returns Whether the operation was successful
 */
export async function rotateSecret(
  name: string,
  generator: () => Promise<string>,
  options: {
    expiresInMinutes?: number;
    sessionOnly?: boolean;
  } = {}
): Promise<boolean> {
  try {
    // Generate new value
    const newValue = await generator();
    
    // Store new value
    return storeSecret(name, newValue, options);
  } catch (error) {
    logger.error(`Error rotating secret ${name}:`, error);
    return false;
  }
}

/**
 * Check if secrets should be rotated
 * @param rotationDays Days after which to rotate secrets
 * @returns Array of secrets that should be rotated
 */
export function getSecretsToRotate(rotationDays: number = 30): string[] {
  try {
    const toRotate: string[] = [];
    const rotationMs = rotationDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    // Check each secret
    listSecrets().forEach(name => {
      const secret = secretCache[name];
      
      if (secret) {
        const createdAt = new Date(secret.createdAt).getTime();
        
        if (now - createdAt > rotationMs) {
          toRotate.push(name);
        }
      } else {
        // Try to get from sessionStorage
        const sessionSecret = sessionStorage.getItem(`secret_${name}`);
        
        if (sessionSecret) {
          try {
            const parsed = JSON.parse(sessionSecret);
            const createdAt = new Date(parsed.createdAt).getTime();
            
            if (now - createdAt > rotationMs) {
              toRotate.push(name);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    });
    
    return toRotate;
  } catch (error) {
    logger.error('Error checking secrets to rotate:', error);
    return [];
  }
}
