
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createTestUser, loginAsTestUser } from '@/components/auth/TestUserCreator';
import { useNavigate } from 'react-router-dom';

// Define test users that can be created with a single click
const testUsers = [
  {
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    label: 'Admin User'
  },
  {
    email: 'manager@example.com',
    password: 'password123',
    firstName: 'Manager',
    lastName: 'User',
    role: UserRole.MANAGER,
    label: 'Property Manager'
  },
  {
    email: 'photographer@example.com',
    password: 'password123',
    firstName: 'Photo',
    lastName: 'Grapher',
    role: UserRole.PHOTOGRAPHER,
    label: 'Photographer'
  }
];

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    
    try {
      const success = await loginAsTestUser(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsRegistering(true);
    
    try {
      const success = await createTestUser({
        email,
        password,
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
        label: 'Test User'
      });
      
      if (success) {
        setError(null);
        navigate('/login');
      } else {
        setError('Failed to create account');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleCreateTestUser = async (user: any) => {
    setError(null);
    
    try {
      await createTestUser(user);
    } catch (err) {
      setError('Failed to create test user');
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Login or create an account to continue</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => navigate('/')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-2">Or create a test user:</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {testUsers.map((user) => (
                        <Button
                          key={user.email}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateTestUser(user)}
                        >
                          Create {user.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => navigate('/')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isRegistering}>
                    {isRegistering ? 'Registering...' : 'Register'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
