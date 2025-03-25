
import { Card, CardFooter } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        {children}
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Property floor plan management system
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
