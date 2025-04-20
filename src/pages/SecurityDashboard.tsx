import React, { useState, useEffect } from 'react';
import { scanForVulnerabilities, ScanResult } from '@/utils/security/vulnerabilityScanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SecurityDashboard = () => {
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Load any previously stored scan results from localStorage
    const storedResults = localStorage.getItem('securityScanResults');
    if (storedResults) {
      try {
        setScanResults(JSON.parse(storedResults));
      } catch (e) {
        console.error('Error parsing stored security scan results:', e);
        setError('Error loading previous scan results.');
      }
    }
  }, []);
  
  const handleSecurityCheck = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await scanForVulnerabilities();
      setScanResults(results);
      
      // Store results in localStorage
      localStorage.setItem('securityScanResults', JSON.stringify(results));
    } catch (e: any) {
      console.error('Security scan failed:', e);
      setError('Security scan failed: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-4">Security Dashboard</h1>
        
        {error && (
          <div className="text-red-500 mb-4">Error: {error}</div>
        )}
        
        <Button
          variant="outline"  // Changed from "success" to "outline"
          onClick={handleSecurityCheck}
        >
          Run Security Check
        </Button>
        
        {isLoading && (
          <div className="mt-4">Scanning for vulnerabilities...</div>
        )}
        
        {scanResults && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">Scan Results</h2>
            <p>Score: {scanResults.score}</p>
            <p>Scan Time: {scanResults.scanTime}</p>
            
            <Card>
              <CardHeader>
                <CardTitle>Critical Issues</CardTitle>
                <CardDescription>
                  {scanResults.criticalIssues.length} critical security issues found.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResults.criticalIssues.map(issue => (
                  <div key={issue.id} className="mb-4">
                    <Badge variant="destructive">Critical</Badge>
                    <h3 className="text-lg font-semibold">{issue.title}</h3>
                    <p>{issue.description}</p>
                    <p>Location: {issue.location}</p>
                    <p>Remediation: {issue.remediation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>High Issues</CardTitle>
                <CardDescription>
                  {scanResults.highIssues.length} high security issues found.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResults.highIssues.map(issue => (
                  <div key={issue.id} className="mb-4">
                    <Badge variant="destructive">High</Badge>
                    <h3 className="text-lg font-semibold">{issue.title}</h3>
                    <p>{issue.description}</p>
                    <p>Location: {issue.location}</p>
                    <p>Remediation: {issue.remediation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Medium Issues</CardTitle>
                <CardDescription>
                  {scanResults.mediumIssues.length} medium security issues found.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResults.mediumIssues.map(issue => (
                  <div key={issue.id} className="mb-4">
                    <Badge variant="warning">Medium</Badge>
                    <h3 className="text-lg font-semibold">{issue.title}</h3>
                    <p>{issue.description}</p>
                    <p>Location: {issue.location}</p>
                    <p>Remediation: {issue.remediation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Low Issues</CardTitle>
                <CardDescription>
                  {scanResults.lowIssues.length} low security issues found.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResults.lowIssues.map(issue => (
                  <div key={issue.id} className="mb-4">
                    <Badge variant="secondary">Low</Badge>
                    <h3 className="text-lg font-semibold">{issue.title}</h3>
                    <p>{issue.description}</p>
                    <p>Location: {issue.location}</p>
                    <p>Remediation: {issue.remediation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Info Issues</CardTitle>
                <CardDescription>
                  {scanResults.infoIssues.length} informational security issues found.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResults.infoIssues.map(issue => (
                  <div key={issue.id} className="mb-4">
                    <Badge variant="secondary">Info</Badge>
                    <h3 className="text-lg font-semibold">{issue.title}</h3>
                    <p>{issue.description}</p>
                    <p>Location: {issue.location}</p>
                    <p>Remediation: {issue.remediation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
