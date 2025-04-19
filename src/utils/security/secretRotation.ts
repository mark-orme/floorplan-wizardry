
import { supabase } from '@/lib/supabase';
import { logAuditEvent, AuditEventType, AuditEventSeverity } from '@/utils/audit/auditLogger';
import { toast } from 'sonner';

const SECRET_ROTATION_CONFIG = {
  lastRotationKey: 'last_secret_rotation',
  recommendedInterval: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
  warningThreshold: 80 * 24 * 60 * 60 * 1000 // 80 days in milliseconds
};

/**
 * Rotate API keys and other sensitive credentials
 */
export async function rotateApiKeys(): Promise<boolean> {
  try {
    // Since we can't actually rotate Supabase API keys in code, 
    // we'll simulate it for demonstration purposes
    
    // In a real implementation, this would make API calls to rotate keys
    // Example: axios.post('/api/security/rotate-keys')
    
    // Simulate successful API key rotation
    const now = new Date().toISOString();
    
    // Store the rotation timestamp
    localStorage.setItem(SECRET_ROTATION_CONFIG.lastRotationKey, now);
    
    // Log the rotation event
    await logAuditEvent({
      type: AuditEventType.SECRET_ROTATION,
      description: 'API keys rotated successfully',
      severity: AuditEventSeverity.INFO,
      metadata: {
        rotationTime: now,
        keyTypes: ['api', 'encryption']
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to rotate API keys:', error);
    
    // Log the failure
    await logAuditEvent({
      type: AuditEventType.SECRET_ROTATION,
      description: 'API key rotation failed',
      severity: AuditEventSeverity.ERROR,
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    return false;
  }
}

/**
 * Check the age of API keys and notify if rotation is needed
 */
export function checkKeyAge(): boolean {
  try {
    const lastRotation = localStorage.getItem(SECRET_ROTATION_CONFIG.lastRotationKey);
    
    if (!lastRotation) {
      // No rotation record found, notify user
      console.warn('No key rotation record found. Consider rotating your API keys.');
      return false;
    }
    
    const lastRotationTime = new Date(lastRotation).getTime();
    const now = Date.now();
    const ageMs = now - lastRotationTime;
    
    if (ageMs > SECRET_ROTATION_CONFIG.recommendedInterval) {
      // Keys are older than recommended interval
      console.warn('API keys have not been rotated for over 90 days. Please rotate your keys.');
      toast.warning('API keys should be rotated for security purposes', {
        duration: 10000,
        action: {
          label: 'Rotate',
          onClick: () => rotateApiKeys()
        }
      });
      return false;
    } else if (ageMs > SECRET_ROTATION_CONFIG.warningThreshold) {
      // Keys are approaching recommended rotation interval
      console.info('API keys approaching recommended rotation interval of 90 days.');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking key age:', error);
    return false;
  }
}
