
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
      .select()
      .eq('userId', userId)
      .order('timestamp', { ascending: false });
    
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
      .select()
      .eq('resource', resource)
      .order('timestamp', { ascending: false });
    
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
