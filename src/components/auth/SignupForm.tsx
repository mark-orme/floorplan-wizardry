
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/lib/supabase';
import React from 'react';

interface SignupFormProps {
  email: string;
  password: string;
  role: UserRole;
  isLoading: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setRole: (value: UserRole) => void;
  handleSignUp: (event: React.FormEvent) => Promise<void>;
}

export const SignupForm = ({
  email,
  password,
  role,
  isLoading,
  setEmail,
  setPassword,
  setRole,
  handleSignUp
}: SignupFormProps) => {
  return (
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
  );
};
