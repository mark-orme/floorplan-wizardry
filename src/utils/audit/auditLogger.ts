
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
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
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
    
    if (error) {
      console.error('Error logging audit event:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error logging audit event:', error);
    return false;
  }
}

export async function getAuditLogs(
  limit: number = 50, 
  userId?: string,
  eventType?: AuditEventType, 
  fromDate?: Date,
  toDate?: Date
): Promise<any[]> {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (fromDate) {
      query = query.gte('created_at', fromDate.toISOString());
    }
    
    if (toDate) {
      query = query.lte('created_at', toDate.toISOString());
    }
    
    // Now apply the limit
    query = query.limit(limit);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching audit logs:', error);
    return [];
  }
}
