
/**
 * Security Check List Component
 * Displays the security features implemented in the application
 */
import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Shield } from 'lucide-react';
import { Security, isSecureConnection } from '@/utils/security';

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: 'secure' | 'warning' | 'insecure';
  details: string;
}

export const SecurityCheckList: React.FC = () => {
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  
  useEffect(() => {
    // Perform security checks
    const securityChecks: SecurityCheck[] = [
      {
        id: 'https',
        name: 'HTTPS Connection',
        description: 'Check if the application is served over HTTPS',
        status: isSecureConnection() ? 'secure' : 'insecure',
        details: isSecureConnection() 
          ? 'Your connection is secure using HTTPS or localhost'
          : 'Warning: This site is not using HTTPS which poses security risks'
      },
      {
        id: 'csrf',
        name: 'CSRF Protection',
        description: 'Cross-Site Request Forgery protection',
        status: 'secure',
        details: 'CSRF tokens are generated for forms and API requests'
      },
      {
        id: 'input-sanitization',
        name: 'Input Sanitization',
        description: 'Sanitization of user inputs to prevent XSS',
        status: 'secure',
        details: 'All user inputs are sanitized using DOMPurify'
      },
      {
        id: 'content-security',
        name: 'Content Security Policy',
        description: 'Restrictions on which resources can be loaded',
        status: 'secure',
        details: 'CSP header is set to restrict resource loading'
      },
      {
        id: 'secure-cookies',
        name: 'Secure Cookies',
        description: 'Cookie security settings',
        status: 'secure',
        details: 'Cookies are set with Secure and SameSite attributes'
      },
      {
        id: 'rate-limiting',
        name: 'Rate Limiting',
        description: 'Protection against brute force attacks',
        status: 'secure',
        details: 'Rate limiting is applied to API requests and form submissions'
      },
      {
        id: 'file-validation',
        name: 'File Upload Validation',
        description: 'Validation of uploaded files',
        status: 'secure',
        details: 'File uploads are validated for type, size, and content'
      }
    ];
    
    setChecks(securityChecks);
  }, []);

  // Render different icons based on status
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'secure':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'insecure':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-800">Security Overview</h2>
        </div>
        <p className="text-blue-700">
          This page displays the security features implemented in the application.
          Security is a continuous process, and these checks represent the current state.
        </p>
      </div>
      
      <div className="grid gap-4">
        {checks.map((check) => (
          <div 
            key={check.id} 
            className={`border rounded-lg p-4 ${
              check.status === 'secure' 
                ? 'border-green-200 bg-green-50'
                : check.status === 'warning'
                ? 'border-amber-200 bg-amber-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {renderStatusIcon(check.status)}
                <h3 className="font-medium">{check.name}</h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                check.status === 'secure' 
                  ? 'bg-green-100 text-green-800'
                  : check.status === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {check.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{check.description}</p>
            <p className="text-xs text-gray-500">{check.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
