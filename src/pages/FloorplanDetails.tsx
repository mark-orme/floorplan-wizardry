
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedDrawingCanvas } from '@/components/EnhancedDrawingCanvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * FloorplanDetails page component
 */
const FloorplanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Floor Plan Details</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'View Mode' : 'Edit Mode'}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Floor Plan #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedDrawingCanvas width={800} height={600} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FloorplanDetails;
