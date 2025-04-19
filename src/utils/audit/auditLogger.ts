
/**
 * Audit Logger
 * 
 * This module provides functions for logging audit events
 * and retrieving audit logs.
 */
import { supabase } from '@/lib/supabase';
import { AuditLogEntry } from '@/types/security-types';
import logger from '@/utils/logger';

/**
 * Audit Event Types
 * Enum for categorizing audit events
 */
export enum AuditEventType {
  USER_AUTH = 'user_authentication',
  USER_ACTION = 'user_action',
  DATA_ACCESS = 'data_access',
  ADMIN_ACTION = 'admin_action',
  SYSTEM_EVENT = 'system_event',
  SECURITY_WARNING = 'security_warning',
  SECURITY_VIOLATION = 'security_violation'
}

/**
 * Log a security event
 * 
 * @param eventType Type of security event
 * @param details Event details
 * @returns Boolean indicating if logging was successful
 */
export const logSecurityEvent = async (
  eventType: AuditEventType, 
  details: Record<string, unknown>
): Promise<boolean> => {
  try {
    logger.info(`Security event: ${eventType}`, details);
    
    // Attempt to log to Supabase if available
    try {
      const { error } = await supabase
        .from('security_logs')
        .insert({
          event_type: eventType,
          details,
          timestamp: new Date()
        });
        
      if (error) {
        logger.warn('Failed to log security event to Supabase', { error });
      }
    } catch (err) {
      // Silent fallback - log locally only
      logger.debug('Supabase logging failed, using local logging only');
    }
    
    return true;
  } catch (err) {
    logger.error('Error logging security event:', err);
    return false;
  }
};

/**
 * Log an audit event
 * 
 * @param userId User ID
 * @param action Action performed
 * @param resource Resource affected
 * @param status Success or failure
 * @param details Additional details
 * @param ipAddress IP address of the request
 * @returns Boolean indicating if logging was successful
 */
export async function logAuditEvent(
  userId: string,
  action: string,
  resource: string,
  status: 'success' | 'failure',
  details: Record<string, unknown> = {},
  ipAddress: string = '0.0.0.0'
): Promise<boolean> {
  try {
    const auditLogEntry: AuditLogEntry = {
      timestamp: new Date(),
      userId,
      action,
      resource,
      status,
      details,
      ipAddress
    };
    
    const { error } = await supabase
      .from('audit_logs')
      .insert(auditLogEntry);
    
    if (error) {
      logger.error('Failed to log audit event:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    logger.error('Error in audit logging:', err);
    return false;
  }
}

/**
 * Get audit logs for a user
 * 
 * @param userId User ID
 * @param limit Maximum number of logs to return
 * @returns Array of audit log entries
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50
): Promise<AuditLogEntry[]> {
  try {
    // Using correct Supabase API pattern
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      logger.error('Failed to retrieve audit logs:', error);
      return [];
    }
    
    return data as AuditLogEntry[];
  } catch (err) {
    logger.error('Error retrieving audit logs:', err);
    return [];
  }
}

/**
 * Get audit logs for a resource
 * 
 * @param resource Resource name
 * @param limit Maximum number of logs to return
 * @returns Array of audit log entries
 */
export async function getResourceAuditLogs(
  resource: string,
  limit: number = 50
): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource', resource)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      logger.error('Failed to retrieve audit logs:', error);
      return [];
    }
    
    return data as AuditLogEntry[];
  } catch (err) {
    logger.error('Error retrieving audit logs:', err);
    return [];
  }
}
