
import { supabase } from '@/lib/supabase';
import { logAuditEvent, AuditEventType, AuditEventSeverity } from '@/utils/audit/auditLogger';

// Simulated security events for demonstration purposes
const DEMO_SECURITY_EVENTS = [
  {
    id: '1',
    type: 'csrf_attempt',
    severity: 'high' as const,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    description: 'CSRF token validation failed on form submission',
    sourceIp: '192.168.1.101',
    status: 'open' as const
  },
  {
    id: '2',
    type: 'rate_limit_exceeded',
    severity: 'medium' as const,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    description: 'API rate limit exceeded for floor plan endpoints',
    sourceIp: '192.168.1.105',
    status: 'resolved' as const
  },
  {
    id: '3',
    type: 'suspicious_login',
    severity: 'high' as const,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    description: 'Login attempt from unusual location',
    sourceIp: '203.0.113.45',
    userId: 'user-789',
    status: 'dismissed' as const
  },
  {
    id: '4',
    type: 'permission_escalation',
    severity: 'critical' as const,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    description: 'Attempt to access admin resources from non-admin account',
    sourceIp: '192.168.1.110',
    userId: 'user-456',
    status: 'open' as const
  },
  {
    id: '5',
    type: 'outdated_dependency',
    severity: 'medium' as const,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    description: 'Security vulnerability found in npm dependency',
    status: 'open' as const
  }
];

/**
 * Fetch security events from the backend
 * For demonstration, returns simulated events
 */
export async function fetchSecurityEvents(): Promise<any[]> {
  try {
    // In a real implementation, we would fetch from Supabase or another source
    // const { data, error } = await supabase.from('security_events').select('*');
    
    // For demonstration, log the request and return demo data
    await logAuditEvent({
      type: AuditEventType.SECURITY_CHECK,
      description: 'Security events fetched',
      severity: AuditEventSeverity.INFO
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return DEMO_SECURITY_EVENTS;
  } catch (error) {
    console.error('Error fetching security events:', error);
    return [];
  }
}

/**
 * Run a security scan and report findings
 */
export async function runSecurityScan(): Promise<{
  vulnerabilitiesFound: number;
  criticalCount: number;
  highCount: number;
  reportUrl: string;
}> {
  try {
    // Simulate a security scan
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate scan results
    const results = {
      vulnerabilitiesFound: 3,
      criticalCount: 0,
      highCount: 1,
      reportUrl: '/security/report'
    };
    
    // Log the scan
    await logAuditEvent({
      type: AuditEventType.SECURITY_CHECK,
      description: `Security scan completed: ${results.vulnerabilitiesFound} vulnerabilities found`,
      severity: results.criticalCount > 0 
        ? AuditEventSeverity.CRITICAL 
        : results.highCount > 0 
          ? AuditEventSeverity.ERROR 
          : AuditEventSeverity.INFO,
      metadata: results
    });
    
    return results;
  } catch (error) {
    console.error('Error running security scan:', error);
    
    await logAuditEvent({
      type: AuditEventType.SECURITY_CHECK,
      description: 'Security scan failed',
      severity: AuditEventSeverity.ERROR,
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    return {
      vulnerabilitiesFound: 0,
      criticalCount: 0,
      highCount: 0,
      reportUrl: ''
    };
  }
}
