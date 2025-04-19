
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { hasCriticalVulnerabilities } from '@/utils/security/dependencyManager';
import { generateCSRFToken, verifyCSRFToken } from '@/utils/security/enhancedCsrfProtection';
import { Loader2, Shield, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

type SecurityCheckStatus = 'pending' | 'running' | 'passed' | 'failed' | 'warning';

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: SecurityCheckStatus;
  runCheck: () => Promise<SecurityCheckStatus>;
}

interface SecurityCheckListProps {
  onCheckComplete?: (passed: number, total: number) => void;
}

export function SecurityCheckList({ onCheckComplete }: SecurityCheckListProps) {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [isRunningAll, setIsRunningAll] = useState(false);
  
  // Initialize security checks
  useEffect(() => {
    const initialChecks: SecurityCheck[] = [
      {
        id: 'dependencies',
        name: 'Dependency Vulnerabilities',
        description: 'Check for known vulnerabilities in dependencies',
        status: 'pending',
        runCheck: async () => {
          // This is just a mock, in a real app it would check dependencies
          const hasCritical = await hasCriticalVulnerabilities();
          return hasCritical ? 'failed' : 'passed';
        }
      },
      {
        id: 'csrf',
        name: 'CSRF Protection',
        description: 'Verify CSRF token generation and validation',
        status: 'pending',
        runCheck: async () => {
          try {
            const token = generateCSRFToken();
            const isValid = verifyCSRFToken(token);
            return isValid ? 'passed' : 'failed';
          } catch (error) {
            console.error('CSRF check failed:', error);
            return 'failed';
          }
        }
      },
      {
        id: 'storage',
        name: 'Secure Storage',
        description: 'Check for secure storage usage',
        status: 'pending',
        runCheck: async () => {
          // Check if localStorage is used for sensitive data
          const hasLocalStorage = Object.keys(localStorage).length > 0;
          return hasLocalStorage ? 'warning' : 'passed';
        }
      },
      {
        id: 'headers',
        name: 'Security Headers',
        description: 'Check for secure HTTP headers',
        status: 'pending',
        runCheck: async () => {
          // In a real app, this would check actual headers
          // For demo, always return warning
          return 'warning';
        }
      }
    ];
    
    setSecurityChecks(initialChecks);
  }, []);
  
  const runCheck = async (checkId: string) => {
    setSecurityChecks(prev => 
      prev.map(check => 
        check.id === checkId 
          ? { ...check, status: 'running' } 
          : check
      )
    );
    
    const checkIndex = securityChecks.findIndex(check => check.id === checkId);
    if (checkIndex === -1) return;
    
    const result = await securityChecks[checkIndex].runCheck();
    
    setSecurityChecks(prev => 
      prev.map(check => 
        check.id === checkId 
          ? { ...check, status: result } 
          : check
      )
    );
  };
  
  const runAllChecks = async () => {
    setIsRunningAll(true);
    
    // Set all checks to running
    setSecurityChecks(prev => 
      prev.map(check => ({ ...check, status: 'running' }))
    );
    
    // Run each check in sequence
    const results = [];
    for (const check of securityChecks) {
      const result = await check.runCheck();
      results.push(result);
      
      // Update status as each check completes
      setSecurityChecks(prev => 
        prev.map(c => 
          c.id === check.id 
            ? { ...c, status: result } 
            : c
        )
      );
    }
    
    setIsRunningAll(false);
    
    // Calculate results
    const passed = results.filter(r => r === 'passed').length;
    const total = results.length;
    
    if (onCheckComplete) {
      onCheckComplete(passed, total);
    }
  };
  
  // Status icon component
  const StatusIcon = ({ status }: { status: SecurityCheckStatus }) => {
    switch (status) {
      case 'pending':
        return <Shield className="h-5 w-5 text-gray-400" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ShieldAlert className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Security Checks</h3>
        <Button 
          onClick={runAllChecks} 
          disabled={isRunningAll}
          className="flex items-center"
        >
          {isRunningAll && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Run All Checks
        </Button>
      </div>
      
      <div className="space-y-3">
        {securityChecks.map(check => (
          <div key={check.id} className="p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <StatusIcon status={check.status} />
                  <h4 className="ml-2 font-medium">{check.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">{check.description}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => runCheck(check.id)}
                disabled={check.status === 'running' || isRunningAll}
              >
                {check.status === 'running' ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Running...
                  </>
                ) : 'Run Check'}
              </Button>
            </div>
            
            {/* Status message */}
            {check.status !== 'pending' && (
              <div className={`mt-2 text-sm px-3 py-1 rounded-full inline-block ${
                check.status === 'passed' ? 'bg-green-100 text-green-800' :
                check.status === 'failed' ? 'bg-red-100 text-red-800' :
                check.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {check.status === 'passed' ? 'Passed' :
                 check.status === 'failed' ? 'Failed' :
                 check.status === 'warning' ? 'Warning' :
                 check.status === 'running' ? 'Running...' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
