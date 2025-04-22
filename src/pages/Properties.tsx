
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';

export default function Properties() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      
      <LoadingErrorWrapper
        isLoading={false}
        hasError={false}
        errorMessage=""
      >
        <div className="rounded-lg border p-6 bg-card">
          {user ? (
            <div>
              <p className="mb-4">Welcome to the Properties page!</p>
              <p className="text-muted-foreground mb-6">You are logged in as: {user.email}</p>
              
              <div className="flex flex-wrap gap-4">
                <Button>Add New Property</Button>
                <Button variant="outline">View All Properties</Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">Please log in to view your properties.</p>
              <Button>Log In</Button>
            </div>
          )}
        </div>
      </LoadingErrorWrapper>
    </div>
  );
}
