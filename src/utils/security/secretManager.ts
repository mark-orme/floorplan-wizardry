
/**
 * Secret Manager
 * Utilities for managing and rotating secrets
 */
import logger from '@/utils/logger';

interface Secret {
  name: string;
  value: string;
  createdAt: Date;
  expiresAt: Date;
  rotated: number; // Number of times the secret has been rotated
  lastRotatedAt: Date;
}

// In-memory store for secrets
// In a real app, this would use a secure storage mechanism
const secretStore: Record<string, Secret> = {};

// Default expiration time (90 days)
const DEFAULT_EXPIRATION_DAYS = 90;

/**
 * Get a secret by name
 * @param name Secret name
 * @returns Secret value or null if not found
 */
export function getSecret(name: string): string | null {
  const secret = secretStore[name];
  
  if (!secret) {
    logger.debug(`Secret ${name} not found`);
    return null;
  }
  
  // Check if expired
  if (new Date() > secret.expiresAt) {
    logger.warn(`Secret ${name} has expired`);
  }
  
  return secret.value;
}

/**
 * Store a secret
 * @param name Secret name
 * @param value Secret value
 * @param expirationDays Days until expiration
 * @returns Boolean indicating success
 */
export function storeSecret(
  name: string,
  value: string,
  expirationDays: number = DEFAULT_EXPIRATION_DAYS
): boolean {
  try {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + expirationDays);
    
    const existingSecret = secretStore[name];
    
    secretStore[name] = {
      name,
      value,
      createdAt: now,
      expiresAt,
      rotated: existingSecret ? existingSecret.rotated + 1 : 0,
      lastRotatedAt: now
    };
    
    logger.info(`Secret ${name} stored with expiration ${expiresAt.toISOString()}`);
    return true;
  } catch (error) {
    logger.error('Error storing secret:', error);
    return false;
  }
}

/**
 * Delete a secret
 * @param name Secret name
 * @returns Boolean indicating success
 */
export function deleteSecret(name: string): boolean {
  if (secretStore[name]) {
    delete secretStore[name];
    logger.info(`Secret ${name} deleted`);
    return true;
  }
  
  logger.warn(`Secret ${name} not found for deletion`);
  return false;
}

/**
 * List all secrets (without values)
 * @returns Array of secret metadata
 */
export function listSecrets(): Array<Omit<Secret, 'value'>> {
  return Object.values(secretStore).map(({ value, ...metadata }) => metadata);
}

/**
 * Rotate a secret
 * @param name Secret name
 * @param newValue New secret value
 * @param expirationDays Days until expiration
 * @returns Boolean indicating success
 */
export function rotateSecret(
  name: string,
  newValue: string,
  expirationDays: number = DEFAULT_EXPIRATION_DAYS
): boolean {
  const existingSecret = secretStore[name];
  
  if (!existingSecret) {
    logger.warn(`Secret ${name} not found for rotation`);
    return false;
  }
  
  return storeSecret(name, newValue, expirationDays);
}

/**
 * Get secrets that need rotation
 * @param daysBeforeExpiration Days before expiration to consider for rotation
 * @returns Array of secret names
 */
export function getSecretsToRotate(daysBeforeExpiration: number = 14): string[] {
  const warningDate = new Date();
  warningDate.setDate(warningDate.getDate() + daysBeforeExpiration);
  
  return Object.values(secretStore)
    .filter(secret => secret.expiresAt <= warningDate)
    .map(secret => secret.name);
}

/**
 * Get expiration status for a secret
 * @param name Secret name
 * @returns Object with expiration info or null if not found
 */
export function getSecretExpirationStatus(name: string): {
  isExpired: boolean;
  daysUntilExpiration: number;
  expiresAt: Date;
} | null {
  const secret = secretStore[name];
  
  if (!secret) {
    return null;
  }
  
  const now = new Date();
  const diffTime = secret.expiresAt.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    isExpired: now > secret.expiresAt,
    daysUntilExpiration: diffDays,
    expiresAt: secret.expiresAt
  };
}
