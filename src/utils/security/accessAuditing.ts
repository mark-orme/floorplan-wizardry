
import { logAuditEvent, AuditEventType, AuditEventSeverity } from '@/utils/audit/auditLogger';

interface AccessAttemptData {
  resourceType: string;
  resourceId?: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'login' | 'logout';
  success: boolean;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Audit an access attempt to a resource
 */
export async function auditAccessAttempt(data: AccessAttemptData): Promise<boolean> {
  const { 
    resourceType, 
    resourceId, 
    action, 
    success, 
    userId, 
    metadata 
  } = data;
  
  let eventType: AuditEventType;
  let severity: AuditEventSeverity;
  
  // Determine event type based on action
  switch (action) {
    case 'login':
      eventType = AuditEventType.USER_LOGIN;
      break;
    case 'logout':
      eventType = AuditEventType.USER_LOGOUT;
      break;
    case 'create':
      if (resourceType === 'floor_plan') {
        eventType = AuditEventType.FLOOR_PLAN_CREATE;
      } else {
        eventType = AuditEventType.API_ACCESS;
      }
      break;
    case 'update':
      if (resourceType === 'floor_plan') {
        eventType = AuditEventType.FLOOR_PLAN_UPDATE;
      } else {
        eventType = AuditEventType.API_ACCESS;
      }
      break;
    case 'delete':
      if (resourceType === 'floor_plan') {
        eventType = AuditEventType.FLOOR_PLAN_DELETE;
      } else {
        eventType = AuditEventType.API_ACCESS;
      }
      break;
    default:
      eventType = AuditEventType.API_ACCESS;
  }
  
  // Determine severity based on success/failure
  if (success) {
    severity = AuditEventSeverity.INFO;
  } else {
    if (action === 'login') {
      severity = AuditEventSeverity.WARNING;
    } else if (['create', 'update', 'delete'].includes(action)) {
      severity = AuditEventSeverity.ERROR;
    } else {
      severity = AuditEventSeverity.WARNING;
    }
  }
  
  // Build description
  let description = `${success ? 'Successful' : 'Failed'} ${action} `;
  description += `on ${resourceType}`;
  if (resourceId) {
    description += ` (${resourceId})`;
  }
  
  // Log the event
  return logAuditEvent({
    type: eventType,
    userId,
    resourceId,
    description,
    severity,
    metadata: {
      ...metadata,
      resourceType,
      action,
      success
    }
  });
}
