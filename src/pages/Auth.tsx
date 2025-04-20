
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UserRole } from '@/lib/supabase';
import { createTestUser, loginAsTestUser, TestUser } from '@/components/auth/TestUserCreator';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestUser = async (role: UserRole) => {
    setLoading(true);
    
    try {
      const testEmail = `test-${role}@example.com`;
      const testPassword = 'password123';
      
      const user: TestUser = {
        email: testEmail,
        password: testPassword,
        role: role,
        label: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`
      };
      
      await createTestUser(user);
      toast.success(`Test ${role} user created: ${testEmail}`);
      
      // Auto login
      await loginAsTestUser(testEmail, testPassword);
      toast.success('Logged in as test user');
      navigate('/');
      
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Log in to access the application</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="test-users">Test Users</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="test-users">
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleCreateTestUser(UserRole.ADMIN)}
                    disabled={loading}
                  >
                    Create & Login as Admin
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleCreateTestUser(UserRole.MANAGER)}
                    disabled={loading}
                  >
                    Create & Login as Manager
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleCreateTestUser(UserRole.PHOTOGRAPHER)}
                    disabled={loading}
                  >
                    Create & Login as Photographer
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleCreateTestUser(UserRole.USER)}
                    disabled={loading}
                  >
                    Create & Login as Regular User
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">
                Test accounts are automatically created with password "password123"
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
