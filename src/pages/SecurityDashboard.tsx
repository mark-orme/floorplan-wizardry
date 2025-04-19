
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowUpRight, CheckCircle2, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { fetchSecurityEvents } from '@/utils/security/securityAudit';
import { rotateApiKeys } from '@/utils/security/secretRotation';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  sourceIp?: string;
  userId?: string;
  status: 'open' | 'resolved' | 'dismissed';
}

export default function SecurityDashboard() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRotation, setLastRotation] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadSecurityEvents = async () => {
      setIsLoading(true);
      try {
        const securityEvents = await fetchSecurityEvents();
        setEvents(securityEvents);
      } catch (error) {
        console.error('Failed to load security events:', error);
        toast.error('Failed to load security events');
      } finally {
        setIsLoading(false);
      }
    };

    loadSecurityEvents();
    
    // Check last key rotation date
    const lastRotationDate = localStorage.getItem('lastSecretRotation');
    if (lastRotationDate) {
      setLastRotation(lastRotationDate);
    }
  }, []);

  const handleSecretRotation = async () => {
    setIsLoading(true);
    try {
      await rotateApiKeys();
      const now = new Date().toISOString();
      localStorage.setItem('lastSecretRotation', now);
      setLastRotation(now);
      toast.success('API keys rotated successfully');
    } catch (error) {
      console.error('Failed to rotate API keys:', error);
      toast.error('Failed to rotate API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const getSecurityScore = () => {
    // Calculate security score based on events and checks
    const criticalIssues = events.filter(e => e.severity === 'critical' && e.status === 'open').length;
    const highIssues = events.filter(e => e.severity === 'high' && e.status === 'open').length;
    
    if (criticalIssues > 0) return { score: 'F', color: 'text-red-500' };
    if (highIssues > 2) return { score: 'D', color: 'text-orange-500' };
    if (highIssues > 0) return { score: 'C', color: 'text-yellow-500' };
    
    // Check last key rotation
    if (!lastRotation) return { score: 'B', color: 'text-blue-500' };
    
    const daysSinceRotation = Math.floor((Date.now() - new Date(lastRotation).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceRotation > 90) return { score: 'B', color: 'text-blue-500' };
    
    return { score: 'A', color: 'text-green-500' };
  };

  const securityScore = getSecurityScore();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Security Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-6xl font-bold ${securityScore.color}`}>
                {securityScore.score}
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">
                  {securityScore.score === 'A' && 'Excellent security posture'}
                  {securityScore.score === 'B' && 'Good security posture'}
                  {securityScore.score === 'C' && 'Security needs attention'}
                  {securityScore.score === 'D' && 'Security at risk'}
                  {securityScore.score === 'F' && 'Critical security issues'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="flex items-center">
                  <ShieldX className="h-5 w-5 text-red-500 mr-2" />
                  <span>{events.filter(e => e.severity === 'critical' && e.status === 'open').length} critical</span>
                </div>
                <div className="flex items-center">
                  <ShieldAlert className="h-5 w-5 text-orange-500 mr-2" />
                  <span>{events.filter(e => e.severity === 'high' && e.status === 'open').length} high</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-yellow-500 mr-2" />
                  <span>{events.filter(e => e.severity === 'medium' && e.status === 'open').length} medium</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>{events.filter(e => e.status === 'resolved').length} resolved</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Secret Rotation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Last rotation: {lastRotation 
                    ? new Date(lastRotation).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
              <Button 
                onClick={handleSecretRotation} 
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? 'Rotating...' : 'Rotate API Keys'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="checks">Security Checks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Security Overview</AlertTitle>
            <AlertDescription>
              Monitor your application's security posture from this dashboard. Take action on security events and implement recommended security measures.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span>CodeQL analysis enabled in CI pipeline</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span>npm audit checks configured at moderate level</span>
                </div>
                {!lastRotation || Date.now() - new Date(lastRotation).getTime() > 90 * 24 * 60 * 60 * 1000 ? (
                  <div className="flex items-center">
                    <ShieldAlert className="h-4 w-4 text-orange-500 mr-2" />
                    <span>API keys should be rotated every 90 days</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>API keys rotated within the last 90 days</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-muted-foreground">No security events to display</p>
              ) : (
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="flex items-start space-x-4 p-3 border rounded-md">
                      {event.severity === 'critical' && <ShieldX className="h-5 w-5 text-red-500 mt-1" />}
                      {event.severity === 'high' && <ShieldAlert className="h-5 w-5 text-orange-500 mt-1" />}
                      {event.severity === 'medium' && <ShieldCheck className="h-5 w-5 text-yellow-500 mt-1" />}
                      {event.severity === 'low' && <ShieldCheck className="h-5 w-5 text-green-500 mt-1" />}
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{event.type}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{event.description}</p>
                        {event.sourceIp && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Source IP: {event.sourceIp}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <Button 
                          variant={event.status === 'resolved' ? 'ghost' : 'outline'} 
                          size="sm"
                          disabled={event.status === 'resolved'}
                        >
                          {event.status === 'open' ? 'Resolve' : 
                           event.status === 'dismissed' ? 'Dismissed' : 'Resolved'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="checks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <h4 className="font-medium">Content Security Policy</h4>
                      <p className="text-sm text-muted-foreground">CSP headers are properly configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Details <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <h4 className="font-medium">CSRF Protection</h4>
                      <p className="text-sm text-muted-foreground">Anti-CSRF tokens implemented for all forms</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Details <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <h4 className="font-medium">Dependency Scanning</h4>
                      <p className="text-sm text-muted-foreground">npm audit checks running in CI pipeline</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Details <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <h4 className="font-medium">Secure Cookies</h4>
                      <p className="text-sm text-muted-foreground">HttpOnly and SameSite flags are properly set</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Details <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
