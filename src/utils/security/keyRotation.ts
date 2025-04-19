
/**
 * Security Key Rotation Utility
 * Handles rotation of security keys and secrets
 */
import { generateCSRFToken } from './enhancedCsrfProtection';
import { toast } from 'sonner';
import { logAuditEvent, AuditEventType, AuditEventSeverity } from '@/utils/audit/auditLogger';

/**
 * Generate a secure random key
 * @param length Length of the key to generate
 * @returns Random key string
 */
export function generateSecureKey(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Rotates the CSRF security key
 * @returns Promise<boolean> Success status
 */
export async function rotateCSRFKey(): Promise<boolean> {
  try {
    // Generate a new CSRF token with a new key
    const newToken = generateCSRFToken(true);
    
    // Store the new token in session storage
    sessionStorage.setItem('csrf_token', newToken);
    
    // Log the key rotation event
    await logAuditEvent({
      type: AuditEventType.SECRET_ROTATION,
      description: 'CSRF security key rotated',
      severity: AuditEventSeverity.INFO,
      metadata: {
        keyType: 'CSRF',
        rotatedAt: new Date().toISOString()
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error rotating CSRF key:', error);
    return false;
  }
}

/**
 * Rotates the encryption key used for offline storage
 * @returns Promise<boolean> Success status
 */
export async function rotateEncryptionKey(): Promise<boolean> {
  try {
    // Generate a new encryption key
    const newKey = generateSecureKey(32);
    
    // Store the new key in local storage
    localStorage.setItem('encryption_key', newKey);
    
    // Re-encrypt any sensitive data with the new key
    // This would involve decrypting with old key and re-encrypting with new key
    
    // Log the key rotation event
    await logAuditEvent({
      type: AuditEventType.SECRET_ROTATION,
      description: 'Encryption key rotated',
      severity: AuditEventSeverity.INFO,
      metadata: {
        keyType: 'ENCRYPTION',
        rotatedAt: new Date().toISOString()
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error rotating encryption key:', error);
    return false;
  }
}

/**
 * Rotate all security keys
 * @returns Promise<boolean> Success status
 */
export async function rotateSecurityKey(): Promise<boolean> {
  try {
    const csrfRotated = await rotateCSRFKey();
    const encryptionRotated = await rotateEncryptionKey();
    
    if (csrfRotated && encryptionRotated) {
      toast.success('Security keys rotated successfully');
      return true;
    } else {
      throw new Error('Failed to rotate some security keys');
    }
  } catch (error) {
    console.error('Error rotating security keys:', error);
    toast.error('Failed to rotate security keys');
    return false;
  }
}
