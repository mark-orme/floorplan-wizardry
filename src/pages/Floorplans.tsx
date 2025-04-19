
import React from 'react';
import { EnhancedDrawingCanvas } from '@/components/EnhancedDrawingCanvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Floorplans page component
 */
const Floorplans = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Floor Plans</h1>
        <Button>Create New</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Floor Plan Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedDrawingCanvas width={800} height={600} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Floorplans;
