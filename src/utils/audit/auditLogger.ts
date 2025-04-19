
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export enum AuditEventType {
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_REGISTER = 'user_register',
  FLOOR_PLAN_CREATE = 'floor_plan_create',
  FLOOR_PLAN_UPDATE = 'floor_plan_update',
  FLOOR_PLAN_DELETE = 'floor_plan_delete',
  FLOOR_PLAN_EXPORT = 'floor_plan_export',
  SECURITY_VIOLATION = 'security_violation',
  SECURITY_CHECK = 'security_check',
  API_ACCESS = 'api_access',
  PERMISSION_CHANGE = 'permission_change',
  SECRET_ROTATION = 'secret_rotation',
  CONFIG_CHANGE = 'config_change'
}

export enum AuditEventSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface AuditEventData {
  type: AuditEventType;
  userId?: string;
  resourceId?: string;
  description: string;
  metadata?: Record<string, any>;
  severity?: AuditEventSeverity;
  sourceIp?: string;
  userAgent?: string;
}

/**
 * Log an audit event to the audit log
 * @param eventData Audit event data
 * @returns Promise<boolean> Success status
 */
export async function logAuditEvent(eventData: AuditEventData): Promise<boolean> {
  try {
    const { 
      type, 
      userId = null, 
      resourceId = null, 
      description, 
      metadata = {}, 
      severity = AuditEventSeverity.INFO,
      sourceIp = null,
      userAgent = null
    } = eventData;
    
    // Get current user if userId not provided
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const { data } = await supabase.auth.getUser();
      effectiveUserId = data?.user?.id || null;
    }
    
    // Get client IP if not provided
    const clientIp = sourceIp || 'unknown';
    
    // Get user agent if not provided
    const clientUserAgent = userAgent || navigator.userAgent || 'unknown';

    // In a real implementation, we would store this in the database
    console.log('Audit Log:', {
      id: uuidv4(),
      event_type: type,
      user_id: effectiveUserId,
      resource_id: resourceId,
      description,
      metadata,
      severity,
      source_ip: clientIp,
      user_agent: clientUserAgent,
      created_at: new Date().toISOString()
    });
    
    // Mock successful storage for this example
    return true;
  } catch (error) {
    console.error('Unexpected error logging audit event:', error);
    return false;
  }
}

/**
 * Get audit logs with filtering options
 * @param limit Maximum number of logs to retrieve
 * @param userId Filter by user ID
 * @param eventType Filter by event type
 * @param fromDate Filter from date
 * @param toDate Filter to date
 * @returns Promise<any[]> Array of audit logs
 */
export async function getAuditLogs(
  limit: number = 50, 
  userId?: string,
  eventType?: AuditEventType, 
  fromDate?: Date,
  toDate?: Date
): Promise<any[]> {
  try {
    // This is a mock implementation for testing
    // In a real implementation, we would query the database

    // Generate mock audit logs
    const mockLogs = Array.from({ length: 10 }, (_, i) => ({
      id: uuidv4(),
      event_type: Object.values(AuditEventType)[i % Object.values(AuditEventType).length],
      user_id: userId || `user-${i % 3}`,
      resource_id: `resource-${i}`,
      description: `Sample audit event ${i + 1}`,
      metadata: { sampleData: `value-${i}` },
      severity: Object.values(AuditEventSeverity)[i % Object.values(AuditEventSeverity).length],
      source_ip: '127.0.0.1',
      user_agent: 'Mozilla/5.0',
      created_at: new Date(Date.now() - i * 3600000).toISOString() // Hours ago
    }));
    
    // Filter mockLogs based on parameters
    let filteredLogs = [...mockLogs];
    
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.user_id === userId);
    }
    
    if (eventType) {
      filteredLogs = filteredLogs.filter(log => log.event_type === eventType);
    }
    
    if (fromDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.created_at) >= fromDate);
    }
    
    if (toDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.created_at) <= toDate);
    }
    
    // Apply limit
    filteredLogs = filteredLogs.slice(0, limit);
    
    return filteredLogs;
  } catch (error) {
    console.error('Unexpected error fetching audit logs:', error);
    return [];
  }
}
