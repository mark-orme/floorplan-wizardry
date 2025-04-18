
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";

export const AuthSection = () => {
  const { user, login } = useAuth();

  const handleLoginAsTestUser = () => {
    try {
      login('photographer@example.com', 'password123')
        .then(() => {
          toast.success('Logged in as test user');
          captureMessage('Test user login successful', 'auth-success', {
            level: 'info',
            tags: {
              operation: 'login'
            }
          });
        })
        .catch(error => {
          toast.error('Login failed: ' + (error.message || 'Unknown error'));
          captureError(error, 'test-login-failed');
        });
    } catch (error) {
      captureError(error, 'login-execution-error');
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className={`bg-muted/30 border-b px-4 py-2 flex items-center justify-between`}>
      <div className="flex items-center space-x-2">
        {user ? (
          <div className="text-sm text-muted-foreground">
            Editing as: <span className="font-medium text-foreground">{user.name || user.email}</span>
          </div>
        ) : (
          <Button variant="outline" onClick={handleLoginAsTestUser}>
            Login as Test User
          </Button>
        )}
      </div>
    </div>
  );
};
