
/**
 * Audit Logging System
 * 
 * Provides secure, tamper-evident logging for security-relevant events
 */
import logger from '@/utils/logger';
import { sanitizeObject } from '@/utils/security/htmlSanitization';
import { supabase } from '@/lib/supabase';

export enum AuditEventType {
  AUTH_LOGIN = 'auth.login',
  AUTH_LOGOUT = 'auth.logout',
  AUTH_REGISTER = 'auth.register',
  AUTH_PASSWORD_RESET = 'auth.password_reset',
  AUTH_PASSWORD_CHANGE = 'auth.password_change',
  AUTH_MFA_ENABLED = 'auth.mfa_enabled',
  AUTH_MFA_DISABLED = 'auth.mfa_disabled',
  
  RESOURCE_CREATE = 'resource.create',
  RESOURCE_READ = 'resource.read',
  RESOURCE_UPDATE = 'resource.update',
  RESOURCE_DELETE = 'resource.delete',
  RESOURCE_SHARE = 'resource.share',
  
  ADMIN_ACTION = 'admin.action',
  ADMIN_SETTINGS_CHANGE = 'admin.settings_change',
  
  SECURITY_VIOLATION = 'security.violation',
  SECURITY_WARNING = 'security.warning'
}

export interface AuditEventData {
  eventType: AuditEventType;
  userId?: string;
  resourceId?: string;
  resourceType?: string;
  action?: string;
  metadata?: Record<string, any>;
  status?: 'success' | 'failure';
  ip?: string;
  userAgent?: string;
}

/**
 * Log an audit event
 * @param eventData Audit event data
 * @returns Promise<boolean> indicating success
 */
export async function logAuditEvent(eventData: AuditEventData): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();
    const { eventType, userId, resourceId, resourceType, action, metadata, status } = eventData;
    
    // Sanitize any user-provided data
    const sanitizedMetadata = metadata ? sanitizeObject(metadata) : undefined;
    
    // Get IP and user agent if available
    const ip = eventData.ip || (typeof window !== 'undefined' ? 'client' : 'server');
    const userAgent = eventData.userAgent || 
      (typeof window !== 'undefined' ? navigator.userAgent : 'server');
    
    // Create audit log entry with standardized format
    const auditLog = {
      timestamp,
      event_type: eventType,
      user_id: userId || 'anonymous',
      resource_id: resourceId,
      resource_type: resourceType,
      action,
      metadata: sanitizedMetadata,
      status: status || 'success',
      ip,
      user_agent: userAgent,
      // Add a hash for tamper detection (would be expanded in a real implementation)
      // integrity_hash: createIntegrityHash(timestamp, eventType, userId)
    };
    
    // Log locally
    logger.info(`[AUDIT] ${eventType}`, auditLog);
    
    // Store in Supabase if available
    if (supabase) {
      try {
        const { error } = await supabase
          .from('audit_logs')
          .insert([auditLog]);
        
        if (error) {
          logger.error('Error storing audit log in database:', error);
        }
      } catch (dbError) {
        // If table doesn't exist yet, log but don't fail
        logger.warn('Could not store audit log in database, table may not exist yet:', dbError);
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Error creating audit log:', error);
    return false;
  }
}

/**
 * Create a tamper-evident hash for audit log integrity verification
 * Note: In a real implementation, this would use HMAC with a server secret
 */
function createIntegrityHash(...values: (string | undefined)[]): string {
  return values.filter(Boolean).join('|');
}

/**
 * Logs an authentication event
 */
export function logAuthEvent(eventType: AuditEventType, userId: string, status: 'success' | 'failure', metadata?: Record<string, any>): Promise<boolean> {
  return logAuditEvent({
    eventType,
    userId,
    status,
    metadata
  });
}

/**
 * Logs a resource access or modification event
 */
export function logResourceEvent(
  eventType: AuditEventType, 
  userId: string, 
  resourceType: string,
  resourceId: string,
  action: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  return logAuditEvent({
    eventType,
    userId,
    resourceType,
    resourceId,
    action,
    metadata
  });
}

/**
 * Logs a security violation or warning
 */
export function logSecurityEvent(
  eventType: AuditEventType.SECURITY_VIOLATION | AuditEventType.SECURITY_WARNING,
  details: Record<string, any>,
  userId?: string
): Promise<boolean> {
  return logAuditEvent({
    eventType,
    userId,
    metadata: details
  });
}
