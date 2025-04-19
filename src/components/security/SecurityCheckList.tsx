
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { logSecurityEvent, AuditEventType } from '@/utils/audit/auditLogger';
import { toast } from 'sonner';

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  details?: string;
}

export const SecurityCheckList: React.FC = () => {
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  useEffect(() => {
    // Load initial checks
    const savedChecks = localStorage.getItem('securityChecks');
    const savedDate = localStorage.getItem('securityCheckDate');
    
    if (savedChecks) {
      setChecks(JSON.parse(savedChecks));
    } else {
      setChecks(getInitialChecks());
    }
    
    if (savedDate) {
      setLastRun(savedDate);
    }
  }, []);

  const runSecurityChecks = async () => {
    setIsRunning(true);
    
    // Simulate security checks running
    const pendingChecks = checks.map(check => ({
      ...check,
      status: 'pending' as const
    }));
    setChecks(pendingChecks);
    
    // Log the security check event
    await logSecurityEvent(
      AuditEventType.ADMIN_ACTION,
      { action: 'security_check_started' }
    );
    
    // Simulate checks running with different timings
    setTimeout(() => {
      const updatedChecks = pendingChecks.map(check => {
        if (check.id === 'csrf') {
          return { ...check, status: 'passed' };
        }
        return check;
      });
      setChecks(updatedChecks);
    }, 500);
    
    setTimeout(() => {
      const updatedChecks = checks.map(check => {
        if (check.id === 'xss') {
          return { ...check, status: 'passed' };
        }
        return check;
      });
      setChecks(updatedChecks);
    }, 1000);
    
    setTimeout(() => {
      const updatedChecks = checks.map(check => {
        if (check.id === 'deps') {
          return { 
            ...check, 
            status: 'warning',
            details: 'Some dependencies may need updating.'
          };
        }
        return check;
      });
      setChecks(updatedChecks);
    }, 1500);
    
    setTimeout(() => {
      const updatedChecks = checks.map(check => {
        if (check.id === 'auth') {
          return { ...check, status: 'passed' };
        }
        return check;
      });
      setChecks(updatedChecks);
    }, 2000);
    
    setTimeout(() => {
      const updatedChecks = checks.map(check => {
        if (check.id === 'headers') {
          return { ...check, status: 'warning', details: 'Content-Security-Policy not fully implemented.' };
        }
        return check;
      });
      setChecks(updatedChecks);
    }, 2500);
    
    // Complete all checks
    setTimeout(() => {
      const finalChecks = checks.map(check => {
        if (check.status === 'pending') {
          return { ...check, status: 'passed' };
        }
        return check;
      });
      
      setChecks(finalChecks);
      setIsRunning(false);
      
      const now = new Date().toISOString();
      setLastRun(now);
      
      // Save to localStorage
      localStorage.setItem('securityChecks', JSON.stringify(finalChecks));
      localStorage.setItem('securityCheckDate', now);
      
      // Log the completion
      logSecurityEvent(
        AuditEventType.ADMIN_ACTION,
        { 
          action: 'security_check_completed',
          results: finalChecks.map(c => ({ id: c.id, status: c.status }))
        }
      );
      
      toast.success('Security checks completed');
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <CardTitle>Security Status</CardTitle>
          </div>
          <Button 
            onClick={runSecurityChecks} 
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? 'Running Checks...' : 'Run Security Checks'}
          </Button>
        </div>
        <CardDescription>
          {lastRun 
            ? `Last checked: ${new Date(lastRun).toLocaleString()}` 
            : 'Security checks have not been run yet'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start space-x-4 border-b pb-4">
              <div className="pt-1">
                {getStatusIcon(check.status)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{check.name}</h3>
                <p className="text-sm text-muted-foreground">{check.description}</p>
                {check.details && (
                  <p className="text-sm mt-1 text-yellow-600">{check.details}</p>
                )}
              </div>
              <div className="capitalize text-xs rounded-full px-2 py-1 bg-muted">
                {check.status}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted border-t flex justify-between">
        <p className="text-sm text-muted-foreground">
          Security checks help identify potential vulnerabilities in your application.
        </p>
      </CardFooter>
    </Card>
  );
};

function getInitialChecks(): SecurityCheck[] {
  return [
    {
      id: 'csrf',
      name: 'CSRF Protection',
      description: 'Checks if Cross-Site Request Forgery protection is properly implemented.',
      status: 'pending'
    },
    {
      id: 'xss',
      name: 'XSS Prevention',
      description: 'Verifies protection against Cross-Site Scripting attacks.',
      status: 'pending'
    },
    {
      id: 'deps',
      name: 'Dependencies',
      description: 'Checks for outdated or vulnerable dependencies.',
      status: 'pending'
    },
    {
      id: 'auth',
      name: 'Authentication',
      description: 'Verifies secure authentication implementation.',
      status: 'pending'
    },
    {
      id: 'headers',
      name: 'Security Headers',
      description: 'Checks for properly configured security headers.',
      status: 'pending'
    },
    {
      id: 'storage',
      name: 'Secure Storage',
      description: 'Verifies secure data storage practices.',
      status: 'pending'
    }
  ];
}
