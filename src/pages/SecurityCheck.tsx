
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Check, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { scanSecurityIssues, ScanResult, SecurityIssue } from '@/utils/security/securityScanner';

export default function SecurityCheck() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Run security scan
  const runSecurityScan = useCallback(async () => {
    setIsScanning(true);
    setScanCompleted(false);
    setError(null);
    
    try {
      const results = await scanSecurityIssues();
      setScanResults(results);
      setScanCompleted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Run scan on initial load
  useEffect(() => {
    runSecurityScan();
  }, [runSecurityScan]);

  // Get severity count 
  const getIssueSeverityCount = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    if (!scanResults?.issues) return 0;
    
    return scanResults.issues.filter(issue => issue.severity === severity).length;
  };

  // Get severity class for styling
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Security Check</h1>
        </div>
        <Button variant="outline" onClick={runSecurityScan} disabled={isScanning}>
          {isScanning ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Run Scan
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Security Scan Results</CardTitle>
          <CardDescription>
            {scanCompleted 
              ? `Scan completed on ${new Date().toLocaleString()}`
              : "Scanning your application for potential security issues..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!scanCompleted && isScanning ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Analyzing security configuration...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Critical</p>
                  <p className="text-2xl font-bold text-red-500">{scanResults && getIssueSeverityCount('critical')}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">High</p>
                  <p className="text-2xl font-bold text-orange-500">{scanResults && getIssueSeverityCount('high')}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Medium</p>
                  <p className="text-2xl font-bold text-yellow-500">{scanResults && getIssueSeverityCount('medium')}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Low</p>
                  <p className="text-2xl font-bold text-blue-500">{scanResults && getIssueSeverityCount('low')}</p>
                </div>
              </div>

              {scanResults && scanResults.issues && scanResults.issues.length > 0 ? (
                <div className="space-y-4">
                  {scanResults.issues.map((issue: SecurityIssue, index: number) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{issue.title}</h3>
                        <Badge className={getSeverityClass(issue.severity)}>{issue.severity}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                      {issue.remediation && (
                        <div className="bg-gray-50 p-2 rounded text-sm">
                          <strong>Recommendation:</strong> {issue.remediation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-md flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>No security issues detected! Your application is secure.</span>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 text-sm text-gray-500">
          Security scan powered by SecurityInit framework
        </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>OWASP Top 10 Web Application Security Risks</li>
              <li>Content Security Policy (CSP) Guidelines</li>
              <li>Cross-Site Scripting (XSS) Prevention</li>
              <li>Cross-Site Request Forgery (CSRF) Protection</li>
              <li>API Security Best Practices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" onClick={() => window.location.href = '/security-dashboard'}>
                View Security Dashboard
              </Button>
              <Button variant="outline" className="w-full" onClick={runSecurityScan}>
                Run Security Scan Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
