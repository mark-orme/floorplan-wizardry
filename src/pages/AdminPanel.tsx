
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/supabase';

/**
 * AdminPanel page component
 */
const AdminPanel = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Manage user accounts and roles</p>
            <Button>View Users</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Manage all properties in the system</p>
            <Button>View Properties</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Floor Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Manage floor plans</p>
            <Button>View Floor Plans</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Configure system settings</p>
            <Button>Edit Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
