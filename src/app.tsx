
import React from 'react';
import { FloorPlanCanvas } from '@/components/canvas/FloorPlanCanvas';
import { Toaster } from 'sonner';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import SecurityInitializer from '@/components/security/SecurityInitializer';

export default function App() {
  return (
    <SecurityProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Initialize security features */}
        <SecurityInitializer />
        
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">Floor Plan Editor</h1>
          
          <div className="border rounded-lg overflow-hidden shadow-lg">
            <FloorPlanCanvas 
              width={800} 
              height={600} 
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Use the tools to create and edit your floor plan.</p>
          </div>
        </div>
      </div>
      
      <Toaster position="top-right" />
    </SecurityProvider>
  );
}
