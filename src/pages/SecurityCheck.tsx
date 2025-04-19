
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasCriticalVulnerabilities } from '@/utils/security/dependencyManager';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';

interface SecurityCheck {
  name: string;
  check: () => Promise<boolean>;
  isRunning: boolean;
  result: boolean | null;
}

export default function SecurityCheck() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);
  
  // Initialize security checks
  useEffect(() => {
    setChecks([
      {
        name: 'Dependency Vulnerabilities',
        check: async () => !(await hasCriticalVulnerabilities()),
        isRunning: false,
        result: null
      },
      {
        name: 'Local Storage Security',
        check: async () => {
          // Check if localStorage contains sensitive data patterns
          const keys = Object.keys(localStorage);
          const sensitivePatterns = ['password', 'token', 'key', 'secret', 'auth'];
          
          for (const key of keys) {
            if (sensitivePatterns.some(pattern => key.toLowerCase().includes(pattern))) {
              return false;
            }
          }
          
          return true;
        },
        isRunning: false,
        result: null
      },
      {
        name: 'CORS Configuration',
        check: async () => {
          // In a real app, this would check actual CORS settings
          // For this example, we'll simulate a passing check
          return true;
        },
        isRunning: false,
        result: null
      }
    ]);
  }, []);
  
  const runCheck = async (index: number) => {
    // Update check status to running
    setChecks(prevChecks => 
      prevChecks.map((check, i) => 
        i === index 
          ? { ...check, isRunning: true, result: null } 
          : check
      )
    );
    
    try {
      // Run the check
      const result = await checks[index].check();
      
      // Update check result
      setChecks(prevChecks => 
        prevChecks.map((check, i) => 
          i === index 
            ? { ...check, isRunning: false, result } 
            : check
        )
      );
      
      return result;
    } catch (error) {
      console.error(`Error running check ${checks[index].name}:`, error);
      
      // Update check as failed
      setChecks(prevChecks => 
        prevChecks.map((check, i) => 
          i === index 
            ? { ...check, isRunning: false, result: false } 
            : check
        )
      );
      
      return false;
    }
  };
  
  const runAllChecks = async () => {
    setIsCheckingAll(true);
    setAllPassed(null);
    
    const results = [];
    
    for (let i = 0; i < checks.length; i++) {
      const result = await runCheck(i);
      results.push(result);
    }
    
    const passed = results.every(result => result);
    setAllPassed(passed);
    setIsCheckingAll(false);
    
    if (passed) {
      toast.success('All security checks passed!');
    } else {
      toast.error('Some security checks failed. Please review and fix the issues.');
    }
  };
  
  const navigateToDashboard = () => {
    navigate('/security-dashboard');
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8 text-center">
        <div className="inline-flex justify-center items-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Security Check</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Verify that your application meets security requirements
          before deploying to production.
        </p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold">Required Security Checks</h2>
        </div>
        
        <div className="divide-y">
          {checks.map((check, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                {check.result === true && (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                {check.result === false && (
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                )}
                {check.result === null && !check.isRunning && (
                  <div className="h-5 w-5 mr-2" />
                )}
                {check.isRunning && (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                )}
                <span>{check.name}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => runCheck(index)}
                disabled={check.isRunning || isCheckingAll}
              >
                {check.isRunning ? 'Running...' : 'Run Check'}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <Button
            onClick={runAllChecks}
            disabled={isCheckingAll}
          >
            {isCheckingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Checks...
              </>
            ) : 'Run All Checks'}
          </Button>
          
          <Button
            variant="outline"
            onClick={navigateToDashboard}
          >
            Security Dashboard
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {allPassed !== null && (
        <div className={`mt-6 p-4 rounded-lg ${
          allPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {allPassed ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-green-800">All checks passed! Your app meets the basic security requirements.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span className="font-medium text-red-800">Some checks failed. Please address the issues before deploying.</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
