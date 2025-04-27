
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define UserRole as an enum
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

interface PropertyHeaderProps {
  title: string;
  description?: string;
  userRole?: string;
  onAddProperty?: () => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  description,
  userRole = UserRole.USER,
  onAddProperty,
  onTabChange,
  activeTab = 'all'
}) => {
  const canAddProperty = userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;

  return (
    <div className="pb-4 border-b mb-6 space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        {canAddProperty && onAddProperty && (
          <Button onClick={onAddProperty}>
            Add Property
          </Button>
        )}
      </div>
      
      {onTabChange && (
        <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Properties</TabsTrigger>
            <TabsTrigger value="mine">My Properties</TabsTrigger>
            <TabsTrigger value="shared">Shared With Me</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
};
