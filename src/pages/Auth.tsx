
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Test users for quick access
const testUsers = [
  { email: 'photographer@nichecom.co.uk', password: 'password1', role: UserRole.PHOTOGRAPHER, label: 'Photographer Test User' },
  { email: 'processing@nichecom.co.uk', password: 'password1', role: UserRole.PROCESSING_MANAGER, label: 'Processing Manager Test User' },
  { email: 'manager@nichecom.co.uk', password: 'password1', role: UserRole.MANAGER, label: 'Manager Test User' },
];

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PHOTOGRAPHER);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isCreatingTestUsers, setIsCreatingTestUsers] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Check and create test users if they don't exist
  useEffect(() => {
    const createTestUsers = async () => {
      try {
        setIsCreatingTestUsers(true);
        let createdUsers = 0;
        
        for (const testUser of testUsers) {
          // Check if user exists
          const { data } = await supabase.auth.signInWithPassword({
            email: testUser.email,
            password: testUser.password,
          });
          
          // If user doesn't exist (sign in failed), create it
          if (!data.user) {
            // Create user
            const { error, data: userData } = await supabase.auth.signUp({
              email: testUser.email,
              password: testUser.password,
            });
            
            if (error) throw error;
            
            // Create user profile with role
            if (userData.user) {
              const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                  user_id: userData.user.id,
                  role: testUser.role,
                  created_at: new Date().toISOString()
                });
                
              if (profileError) throw profileError;
              createdUsers++;
            }
          }
        }
        
        // Sign out after creating test users
        await supabase.auth.signOut();
        
        if (createdUsers > 0) {
          toast.success(`${createdUsers} test user(s) created successfully!`);
        } else {
          toast.info('All test users already exist.');
        }
      } catch (error: any) {
        console.error('Error creating test users:', error);
        toast.error(error.message || 'Error creating test users');
      } finally {
        setIsCreatingTestUsers(false);
      }
    };
    
    createTestUsers();
  }, []);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      navigate('/properties');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(email, password, role);
      navigate('/properties');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectTestUser = (testUser: typeof testUsers[0]) => {
    setEmail(testUser.email);
    setPassword(testUser.password);
    setRole(testUser.role);
    
    // Switch to the appropriate tab based on whether this is for sign-in or sign-up
    if (activeTab === 'signup') {
      setActiveTab('login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <TabsList className="grid w-3/4 grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isCreatingTestUsers}>
                    Test Users <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {testUsers.map((user, index) => (
                    <DropdownMenuItem 
                      key={index} 
                      onClick={() => selectTestUser(user)}
                      className="flex flex-col items-start"
                    >
                      <span className="font-medium">{user.label}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>
              Access the property floor plan system
            </CardDescription>
            {isCreatingTestUsers && (
              <div className="mt-2 text-xs text-muted-foreground">
                Setting up test users...
              </div>
            )}
          </CardHeader>

          <CardContent>
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={role} 
                      onValueChange={(value) => setRole(value as UserRole)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.PHOTOGRAPHER}>Photographer</SelectItem>
                        <SelectItem value={UserRole.PROCESSING_MANAGER}>Processing Manager</SelectItem>
                        <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {role === UserRole.PHOTOGRAPHER && 'Create properties and floor plans'}
                      {role === UserRole.PROCESSING_MANAGER && 'Review and process floor plans'}
                      {role === UserRole.MANAGER && 'Full access to all properties and settings'}
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Property floor plan management system
            </p>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
