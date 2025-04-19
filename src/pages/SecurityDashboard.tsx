
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';
import { scanForVulnerabilities } from '@/utils/security/vulnerabilityScanner';
import { getAuditLogs, AuditEventType, AuditEventSeverity } from '@/utils/audit/auditLogger';
import { rotateApiKeys } from '@/utils/security/secretRotation';
import { fetchSecurityEvents } from '@/utils/security/securityAudit';
import { toast } from 'sonner';

// Dashboard component
export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [securityScore, setSecurityScore] = useState(85);
  const [isScanning, setIsScanning] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  
  useEffect(() => {
    // Load initial data
    fetchAuditLogs();
    fetchSecurityEventData();
  }, []);
  
  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await getAuditLogs(50);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setIsLoadingLogs(false);
    }
  };
  
  const fetchSecurityEventData = async () => {
    try {
      const events = await fetchSecurityEvents();
      setSecurityEvents(events);
    } catch (error) {
      console.error('Error fetching security events:', error);
    }
  };
  
  const handleScanSystem = async () => {
    setIsScanning(true);
    try {
      const results = await scanForVulnerabilities();
      
      // Update security score based on results
      const newScore = calculateSecurityScore(results);
      setSecurityScore(newScore);
      
      if (results.criticalIssues.length > 0) {
        toast.error(`Found ${results.criticalIssues.length} critical issues!`);
      } else if (results.highIssues.length > 0) {
        toast.warning(`Found ${results.highIssues.length} high severity issues.`);
      } else {
        toast.success('No critical or high severity issues found.');
      }
      
    } catch (error) {
      console.error('Error scanning for vulnerabilities:', error);
      toast.error('Failed to complete security scan');
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleRotateKeys = async () => {
    setIsRotatingKeys(true);
    try {
      await rotateApiKeys();
      toast.success('API keys rotated successfully');
      fetchAuditLogs(); // Refresh logs
    } catch (error) {
      console.error('Error rotating API keys:', error);
      toast.error('Failed to rotate API keys');
    } finally {
      setIsRotatingKeys(false);
    }
  };
  
  const calculateSecurityScore = (scanResults: any) => {
    // Simple calculation - can be made more sophisticated
    const critical = scanResults.criticalIssues.length * 15;
    const high = scanResults.highIssues.length * 10;
    const medium = scanResults.mediumIssues.length * 5;
    const low = scanResults.lowIssues.length * 2;
    
    const totalDeduction = critical + high + medium + low;
    return Math.max(0, Math.min(100, 100 - totalDeduction));
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchAuditLogs} 
            disabled={isLoadingLogs}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Logs
          </Button>
          <Button 
            onClick={handleScanSystem} 
            disabled={isScanning}
          >
            <Shield className="h-4 w-4 mr-2" />
            {isScanning ? 'Scanning...' : 'Scan System'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auditLogs">Audit Logs</TabsTrigger>
          <TabsTrigger value="securityEvents">Security Events</TabsTrigger>
          <TabsTrigger value="keyManagement">Key Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-4xl font-bold ${getScoreColor(securityScore)}`}>
                  {securityScore}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {securityScore >= 80 ? 'Good' : securityScore >= 60 ? 'Needs Improvement' : 'Critical'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Last Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">
                  {isScanning ? 'Running Scan...' : '2 days ago'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {isScanning ? 'Please wait...' : 'Regular scans recommended'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">
                  {securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Critical or high severity in last 30 days
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="mb-6">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Security Recommendations</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2">
                <li>Enable two-factor authentication for all admin accounts</li>
                <li>Rotate API keys on a monthly schedule</li>
                <li>Review user access permissions regularly</li>
                <li>Keep all dependencies updated to latest secure versions</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          {securityScore < 70 && (
            <Alert variant="destructive" className="mb-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Critical Security Issues</AlertTitle>
              <AlertDescription>
                Your security score is below the recommended threshold of 70%.
                Please address the issues identified in the security scan.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="auditLogs">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <p>Loading audit logs...</p>
              ) : auditLogs.length === 0 ? (
                <p>No audit logs found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2">Time</th>
                        <th className="text-left p-2">Event</th>
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Severity</th>
                        <th className="text-left p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                          <td className="p-2">{log.event_type}</td>
                          <td className="p-2">{log.user_id?.substring(0, 8) || 'System'}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              log.severity === AuditEventSeverity.CRITICAL ? 'bg-red-100 text-red-800' :
                              log.severity === AuditEventSeverity.ERROR ? 'bg-orange-100 text-orange-800' :
                              log.severity === AuditEventSeverity.WARNING ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="p-2">{log.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="securityEvents">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              {securityEvents.length === 0 ? (
                <p>No security events found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2">Time</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Severity</th>
                        <th className="text-left p-2">Source</th>
                        <th className="text-left p-2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityEvents.map((event, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{new Date(event.timestamp).toLocaleString()}</td>
                          <td className="p-2">{event.type}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {event.severity}
                            </span>
                          </td>
                          <td className="p-2">{event.source}</td>
                          <td className="p-2">{event.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="keyManagement">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Current Keys</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded p-4">
                    <p className="font-medium">Main API Key</p>
                    <p className="text-sm text-gray-500">Last rotated: 30 days ago</p>
                    <p className="mt-2 text-xs">
                      Key: <code>••••••••••••••••</code>
                    </p>
                  </div>
                  <div className="border rounded p-4">
                    <p className="font-medium">Secondary API Key</p>
                    <p className="text-sm text-gray-500">Last rotated: 15 days ago</p>
                    <p className="mt-2 text-xs">
                      Key: <code>••••••••••••••••</code>
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Key Rotation</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Rotating keys helps maintain security by limiting the time credentials are valid.
                  We recommend rotating keys every 30-90 days.
                </p>
                <Button 
                  onClick={handleRotateKeys} 
                  disabled={isRotatingKeys}
                  variant="outline"
                >
                  {isRotatingKeys ? 'Rotating Keys...' : 'Rotate API Keys'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
