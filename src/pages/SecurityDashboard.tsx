
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  RefreshCcw, 
  Lock, 
  User, 
  Key, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { getAuditLogs, AuditEventType, AuditEventSeverity } from '@/utils/audit/auditLogger';
import { rotateSecurityKey } from '@/utils/security/keyRotation';

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [keyRotationStatus, setKeyRotationStatus] = useState<'idle' | 'rotating' | 'success' | 'error'>('idle');

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const logs = await getAuditLogs(50);
      setAuditLogs(logs);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audit logs';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch audit logs on mount
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Handle key rotation
  const handleKeyRotation = async () => {
    setKeyRotationStatus('rotating');
    try {
      await rotateSecurityKey();
      setKeyRotationStatus('success');
      setTimeout(() => setKeyRotationStatus('idle'), 3000);
    } catch (err) {
      setKeyRotationStatus('error');
      setTimeout(() => setKeyRotationStatus('idle'), 3000);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get severity badge color
  const getSeverityColor = (severity: AuditEventSeverity) => {
    switch (severity) {
      case AuditEventSeverity.CRITICAL:
        return 'bg-red-500 text-white';
      case AuditEventSeverity.ERROR:
        return 'bg-orange-500 text-white';
      case AuditEventSeverity.WARNING:
        return 'bg-yellow-500 text-black';
      case AuditEventSeverity.INFO:
      default:
        return 'bg-blue-500 text-white';
    }
  };

  // Get audit event icon
  const getEventIcon = (type: AuditEventType) => {
    switch (type) {
      case AuditEventType.USER_LOGIN:
      case AuditEventType.USER_LOGOUT:
      case AuditEventType.USER_REGISTER:
        return <User className="h-4 w-4" />;
      case AuditEventType.SECURITY_VIOLATION:
      case AuditEventType.SECURITY_CHECK:
        return <AlertTriangle className="h-4 w-4" />;
      case AuditEventType.SECRET_ROTATION:
        return <Key className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
        </div>
        <Button variant="outline" onClick={fetchAuditLogs} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auditLogs">Audit Logs</TabsTrigger>
          <TabsTrigger value="keyManagement">Security Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Current security status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-green-500 gap-2 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Secure</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-100 p-3 rounded-md flex justify-between">
                    <span className="text-sm">CSRF Protection</span>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md flex justify-between">
                    <span className="text-sm">Content Security Policy</span>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-md flex justify-between">
                    <span className="text-sm">XSS Protection</span>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest security events</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : auditLogs.length > 0 ? (
                  <div className="space-y-3">
                    {auditLogs.slice(0, 5).map((log, index) => (
                      <div key={index} className="border-b pb-2 flex items-start gap-2">
                        <div className="mt-0.5">
                          {getEventIcon(log.event_type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{log.description}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(log.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent activity
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Check</CardTitle>
                <CardDescription>Run security assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Run a comprehensive security check to identify potential vulnerabilities.
                </p>
                <Button className="w-full" onClick={() => window.location.href = '/security'}>
                  <Shield className="mr-2 h-4 w-4" />
                  Run Security Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auditLogs">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Security event history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : auditLogs.length > 0 ? (
                <div className="space-y-4">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium flex items-center gap-2">
                          {getEventIcon(log.event_type)}
                          {log.description}
                        </div>
                        <Badge className={getSeverityColor(log.severity || 'info')}>
                          {log.severity || 'info'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(log.created_at)}
                      </div>
                      {log.user_id && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          User ID: {log.user_id}
                        </div>
                      )}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-2 bg-gray-50 p-2 rounded text-xs">
                          <div className="font-medium mb-1">Additional Details:</div>
                          <pre className="whitespace-pre-wrap overflow-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No audit logs found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keyManagement">
          <Card>
            <CardHeader>
              <CardTitle>Security Key Management</CardTitle>
              <CardDescription>Manage application security keys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        CSRF Security Key
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Used for Cross-Site Request Forgery protection
                      </p>
                    </div>
                    <Button 
                      onClick={handleKeyRotation}
                      disabled={keyRotationStatus === 'rotating'}
                      variant={
                        keyRotationStatus === 'success' ? 'success' :
                        keyRotationStatus === 'error' ? 'destructive' : 'default'
                      }
                    >
                      {keyRotationStatus === 'rotating' ? (
                        <>
                          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                          Rotating...
                        </>
                      ) : keyRotationStatus === 'success' ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Rotated
                        </>
                      ) : keyRotationStatus === 'error' ? (
                        <>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Failed
                        </>
                      ) : (
                        <>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Rotate Key
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Last rotated: {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <h3 className="font-medium mb-2">Key Rotation Best Practices:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Rotate security keys regularly (every 30-90 days)</li>
                    <li>Rotate immediately if you suspect a security breach</li>
                    <li>Keep backup of previous keys during transition periods</li>
                    <li>Monitor key usage after rotation to ensure proper functioning</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
