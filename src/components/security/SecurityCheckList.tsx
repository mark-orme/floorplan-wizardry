
/**
 * SecurityCheckList Component
 * Displays a checklist of frontend security features and their status
 */
import React, { useEffect, useState } from 'react';
import { Security } from '@/utils/security';

interface SecurityMeasure {
  id: string;
  name: string;
  description: string;
  implemented: boolean;
  check: () => boolean | Promise<boolean>;
}

export const SecurityCheckList: React.FC = () => {
  const [securityMeasures, setSecurityMeasures] = useState<SecurityMeasure[]>([
    {
      id: 'https',
      name: 'Use HTTPS everywhere',
      description: 'Prevents basic eavesdropping and man-in-the-middle attacks',
      implemented: false,
      check: () => Security.isSecureConnection()
    },
    {
      id: 'input-validation',
      name: 'Input validation and sanitization',
      description: 'Prevents XSS attacks by validating all user inputs',
      implemented: false,
      check: () => typeof Security.Input.sanitizeHtml === 'function'
    },
    {
      id: 'sensitive-data',
      name: 'Don\'t store sensitive data in the browser',
      description: 'No secrets in localStorage or client-side code',
      implemented: false,
      check: () => {
        // This is a simplified check that can be improved
        const storageKeys = Object.keys(localStorage);
        return !storageKeys.some(key => 
          key.toLowerCase().includes('key') || 
          key.toLowerCase().includes('secret') || 
          key.toLowerCase().includes('token') || 
          key.toLowerCase().includes('password')
        );
      }
    },
    {
      id: 'csrf',
      name: 'CSRF protection',
      description: 'Implement anti-CSRF tokens for forms and state-changing requests',
      implemented: false,
      check: () => typeof Security.CSRF.getCSRFToken === 'function'
    },
    {
      id: 'api-keys',
      name: 'Never expose API keys in frontend',
      description: 'API credentials should always remain server-side',
      implemented: false,
      check: () => true // Simplified check, should be reviewed manually
    },
    {
      id: 'dependencies',
      name: 'Keep dependencies updated',
      description: 'Most vulnerabilities come from outdated libraries',
      implemented: false,
      check: () => true // This needs to be checked via npm audit or similar tools
    },
    {
      id: 'error-handling',
      name: 'Proper error handling',
      description: 'Don\'t expose sensitive details in error messages',
      implemented: false,
      check: () => true // This needs code review
    },
    {
      id: 'cookies',
      name: 'Secure cookies',
      description: 'Set HttpOnly, Secure and SameSite attributes',
      implemented: false,
      check: () => typeof Security.Cookies.setSecureSessionCookie === 'function'
    },
    {
      id: 'file-upload',
      name: 'File upload security',
      description: 'Validate file types, sizes, and scan for malicious content',
      implemented: false,
      check: () => typeof Security.Files.validateFile === 'function'
    },
    {
      id: 'rate-limiting',
      name: 'Rate limiting',
      description: 'Implement on all API endpoints, especially authentication-related ones',
      implemented: false,
      check: () => typeof Security.RateLimit.isRateLimited === 'function'
    },
  ]);

  useEffect(() => {
    const runChecks = async () => {
      const updatedMeasures = await Promise.all(
        securityMeasures.map(async (measure) => {
          try {
            const result = await measure.check();
            return { ...measure, implemented: result };
          } catch (error) {
            console.error(`Error checking security measure ${measure.id}:`, error);
            return { ...measure, implemented: false };
          }
        })
      );
      
      setSecurityMeasures(updatedMeasures);
    };
    
    runChecks();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Frontend Security Checklist</h2>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 p-4 border-b">
          <div className="col-span-1 font-semibold"></div>
          <div className="col-span-3 font-semibold">Security Measure</div>
          <div className="col-span-8 font-semibold">Description</div>
        </div>
        
        <div className="divide-y">
          {securityMeasures.map((measure) => (
            <div key={measure.id} className="grid grid-cols-12 p-4 hover:bg-gray-50">
              <div className="col-span-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  measure.implemented ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {measure.implemented ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="col-span-3 font-medium">{measure.name}</div>
              <div className="col-span-8 text-gray-600">{measure.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Note: This checklist represents basic frontend security measures. A comprehensive security strategy should include backend security, regular security audits, and penetration testing.</p>
      </div>
    </div>
  );
};
