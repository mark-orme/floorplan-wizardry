
/**
 * Security Scanner Utility
 * Provides security scanning and issue detection functionality
 */

// Define security issue interface
export interface SecurityIssue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  remediation?: string;
  references?: string[];
}

// Define scan result interface
export interface ScanResult {
  timestamp: string;
  issues: SecurityIssue[];
  summary: {
    totalIssues: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
}

/**
 * Check if Content Security Policy is properly configured
 */
function checkContentSecurityPolicy(): SecurityIssue | null {
  // Check for CSP meta tag
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  
  if (!cspMeta) {
    return {
      id: 'CSP001',
      title: 'Content Security Policy Not Configured',
      description: 'No Content Security Policy (CSP) meta tag was found on the page.',
      severity: 'high',
      category: 'Headers',
      remediation: 'Add a Content Security Policy meta tag to restrict which resources can be loaded.',
      references: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP']
    };
  }
  
  const cspContent = cspMeta.getAttribute('content') || '';
  
  // Check if CSP allows unsafe inline scripts
  if (cspContent.includes("'unsafe-inline'")) {
    return {
      id: 'CSP002',
      title: 'Content Security Policy Allows Unsafe Inline Scripts',
      description: 'The Content Security Policy allows unsafe inline scripts, which can be a security risk.',
      severity: 'medium',
      category: 'Headers',
      remediation: 'Avoid using unsafe-inline in your CSP. Use nonces or hashes instead.',
      references: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src']
    };
  }
  
  return null;
}

/**
 * Check if CSRF protection is properly implemented
 */
function checkCSRFProtection(): SecurityIssue | null {
  // Check for CSRF token in forms
  const forms = document.querySelectorAll('form');
  let csrfTokenFound = false;
  
  for (const form of forms) {
    const csrfInput = form.querySelector('input[name="csrf_token"]');
    if (csrfInput) {
      csrfTokenFound = true;
      break;
    }
  }
  
  if (forms.length > 0 && !csrfTokenFound) {
    return {
      id: 'CSRF001',
      title: 'CSRF Protection Not Implemented',
      description: 'Forms were found without CSRF token inputs.',
      severity: 'high',
      category: 'CSRF',
      remediation: 'Add CSRF token inputs to all forms that modify data.',
      references: ['https://owasp.org/www-community/attacks/csrf']
    };
  }
  
  return null;
}

/**
 * Check if Referrer Policy is properly configured
 */
function checkReferrerPolicy(): SecurityIssue | null {
  // Check for Referrer-Policy meta tag
  const referrerMeta = document.querySelector('meta[name="referrer"]');
  
  if (!referrerMeta) {
    return {
      id: 'RP001',
      title: 'Referrer Policy Not Configured',
      description: 'No Referrer Policy meta tag was found on the page.',
      severity: 'medium',
      category: 'Headers',
      remediation: 'Add a Referrer Policy meta tag to control what information is sent in the Referer header.',
      references: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy']
    };
  }
  
  return null;
}

/**
 * Scan for security issues
 * @returns Promise<ScanResult> Scan results
 */
export async function scanSecurityIssues(): Promise<ScanResult> {
  // Collect issues
  const issues: SecurityIssue[] = [];
  
  // Check CSP
  const cspIssue = checkContentSecurityPolicy();
  if (cspIssue) issues.push(cspIssue);
  
  // Check CSRF
  const csrfIssue = checkCSRFProtection();
  if (csrfIssue) issues.push(csrfIssue);
  
  // Check Referrer Policy
  const referrerIssue = checkReferrerPolicy();
  if (referrerIssue) issues.push(referrerIssue);
  
  // Count issues by severity
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const highCount = issues.filter(i => i.severity === 'high').length;
  const mediumCount = issues.filter(i => i.severity === 'medium').length;
  const lowCount = issues.filter(i => i.severity === 'low').length;
  
  // Return scan results
  return {
    timestamp: new Date().toISOString(),
    issues,
    summary: {
      totalIssues: issues.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount
    }
  };
}
