
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SecurityCheckList } from '@/components/security/SecurityCheckList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { hasCriticalVulnerabilities } from '@/utils/security/dependencyManager';

/**
 * Security Check Page
 * Displays security checks and allows running them
 */
export default function SecurityCheck() {
  const [score, setScore] = useState<number | null>(null);
  const [hasCritical, setHasCritical] = useState(false);
  
  useEffect(() => {
    // Check for critical vulnerabilities
    const checkVulnerabilities = async () => {
      const critical = await hasCriticalVulnerabilities();
      setHasCritical(critical);
    };
    
    checkVulnerabilities();
  }, []);
  
  const handleCheckComplete = (passed: number, total: number) => {
    setScore(Math.round((passed / total) * 100));
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Security Checks</h1>
          <p className="text-gray-600">
            Run security checks to ensure your application is secure.
          </p>
        </div>
        <Link to="/security-dashboard">
          <Button variant="outline">Advanced Security Dashboard</Button>
        </Link>
      </div>
      
      {score !== null && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Security Score</CardTitle>
            <CardDescription>
              Based on the security checks that passed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div 
                className={`text-3xl font-bold mr-4 ${
                  score >= 90 ? 'text-green-600' :
                  score >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}
              >
                {score}%
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      score >= 90 ? 'bg-green-500' :
                      score >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {hasCritical && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Critical Vulnerabilities Detected
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Your application has critical security vulnerabilities that need immediate attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <SecurityCheckList onCheckComplete={handleCheckComplete} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            Security checks are based on OWASP Top 10 and industry best practices.
          </p>
          <Link to="/security-dashboard">
            <Button variant="link" size="sm">View detailed reports</Button>
          </Link>
        </CardFooter>
      </Card>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
            <CardDescription>
              Follow these recommendations to improve your security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Implement Web Crypto API for offline data encryption</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Add rate limiting middleware to prevent abuse</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Enhance CSRF protection with double submit pattern</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Commission an external penetration test</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Resources</CardTitle>
            <CardDescription>
              Helpful resources to improve your application security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://owasp.org/www-project-top-ten/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  OWASP Top 10
                </a>
              </li>
              <li>
                <a 
                  href="https://cheatsheetseries.owasp.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  OWASP Cheat Sheet Series
                </a>
              </li>
              <li>
                <a 
                  href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Web Crypto API Docs
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
