
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/lib/supabase';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { createTestUsers, testUsers } from '@/components/auth/TestUserCreator';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PHOTOGRAPHER);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isCreatingTestUsers, setIsCreatingTestUsers] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to properties page');
      navigate('/properties');
    }
  }, [user, navigate]);

  // Create test users on component mount
  useEffect(() => {
    const setupTestUsers = async () => {
      try {
        setIsCreatingTestUsers(true);
        await createTestUsers();
      } finally {
        setIsCreatingTestUsers(false);
      }
    };
    
    setupTestUsers();
  }, []);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      console.log('Sign in successful, waiting for auth state update...');
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
      console.log('Sign up successful, waiting for auth state update...');
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
    <AuthLayout>
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <AuthHeader 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          testUsers={testUsers}
          selectTestUser={selectTestUser}
          isCreatingTestUsers={isCreatingTestUsers}
        />

        <CardContent>
          <TabsContent value="login">
            <LoginForm
              email={email}
              password={password}
              isLoading={isLoading}
              setEmail={setEmail}
              setPassword={setPassword}
              handleSignIn={handleSignIn}
            />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm
              email={email}
              password={password}
              role={role}
              isLoading={isLoading}
              setEmail={setEmail}
              setPassword={setPassword}
              setRole={setRole}
              handleSignUp={handleSignUp}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Auth;
