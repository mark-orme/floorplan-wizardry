
import { CardDescription, CardHeader } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserRole } from '@/lib/supabase';
import React from 'react';

interface TestUser {
  email: string;
  password: string;
  role: UserRole;
  label: string;
}

interface AuthHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  testUsers: TestUser[];
  selectTestUser: (user: TestUser) => void;
  isCreatingTestUsers: boolean;
}

export const AuthHeader = ({ 
  activeTab, 
  setActiveTab, 
  testUsers, 
  selectTestUser, 
  isCreatingTestUsers 
}: AuthHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center mb-2">
        <TabsList className="grid w-3/4 grid-cols-2">
          <TabsTrigger value="login" onClick={() => setActiveTab("login")}>Login</TabsTrigger>
          <TabsTrigger value="signup" onClick={() => setActiveTab("signup")}>Sign Up</TabsTrigger>
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
  );
};
