/**
 * Security Audit Utilities
 * Functions for logging and retrieving security events
 */

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: SecurityEventType;
  userId?: string;
  resourceId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

type SecurityEventType = 
  | 'authentication_success'
  | 'authentication_failure'
  | 'authorization_failure'
  | 'resource_access'
  | 'resource_modification'
  | 'configuration_change'
  | 'security_violation'
  | 'rate_limit_exceeded';

/**
 * Log a security event
 * @param eventType Type of security event
 * @param description Description of the event
 * @param details Additional event details
 */
export async function logSecurityEvent(
  eventType: SecurityEventType,
  description: string,
  details: {
    userId?: string;
    resourceId?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    ipAddress?: string;
    userAgent?: string;
  } = {}
): Promise<void> {
  try {
    const event: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      eventType,
      description,
      userId: details.userId,
      resourceId: details.resourceId,
      severity: details.severity || 'low',
      ipAddress: details.ipAddress || getClientIP(),
      userAgent: details.userAgent || navigator.userAgent
    };
    
    // Store event in localStorage for now
    // In a real app, this would be sent to a secure endpoint
    const events = getStoredEvents();
    events.push(event);
    
    // Keep only the most recent 1000 events to prevent storage overflow
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem('security_events', JSON.stringify(events));
    
    console.debug(`Security event logged: ${eventType} - ${description}`);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * Fetch security events from storage
 * @param filters Optional filters to apply to events
 */
export function fetchSecurityEvents(filters: {
  eventType?: SecurityEventType;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  limit?: number;
} = {}): SecurityEvent[] {
  try {
    const allEvents = getStoredEvents();
    
    // Apply filters
    let filteredEvents = allEvents;
    
    if (filters.eventType) {
      filteredEvents = filteredEvents.filter(e => e.eventType === filters.eventType);
    }
    
    if (filters.userId) {
      filteredEvents = filteredEvents.filter(e => e.userId === filters.userId);
    }
    
    if (filters.fromDate) {
      const fromTimestamp = new Date(filters.fromDate).getTime();
      filteredEvents = filteredEvents.filter(e => new Date(e.timestamp).getTime() >= fromTimestamp);
    }
    
    if (filters.toDate) {
      const toTimestamp = new Date(filters.toDate).getTime();
      filteredEvents = filteredEvents.filter(e => new Date(e.timestamp).getTime() <= toTimestamp);
    }
    
    if (filters.severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
    }
    
    // Sort by timestamp descending (newest first)
    filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply limit if specified
    if (filters.limit && filters.limit > 0) {
      filteredEvents = filteredEvents.slice(0, filters.limit);
    }
    
    return filteredEvents;
  } catch (error) {
    console.error('Failed to fetch security events:', error);
    return [];
  }
}

/**
 * Get stored security events from localStorage
 */
function getStoredEvents(): SecurityEvent[] {
  try {
    const eventsJson = localStorage.getItem('security_events');
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Failed to parse stored security events:', error);
    return [];
  }
}

/**
 * Get client IP address (best effort, may not be accurate)
 */
function getClientIP(): string {
  // This is a placeholder - in a real app, you'd get the IP from the server
  return 'client';
}
