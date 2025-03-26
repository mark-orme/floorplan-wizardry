
import { useState, useEffect } from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";

/**
 * Main Index page component
 * Provides the layout and navigation for the floor plan editor
 * @returns {JSX.Element} Rendered component
 */
const Index = () => {
  const navigate = useNavigate();
  
  // Reset canvas initialization state when the page loads
  useEffect(() => {
    resetInitializationState();
  }, []);
  
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="flex items-center p-2 bg-muted/30 border-b">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/properties')}
          className="mr-2"
        >
          <Home className="h-4 w-4 mr-1" />
          Back to Properties
        </Button>
        <h1 className="text-xl font-bold">Floor Plan Editor</h1>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CanvasControllerProvider>
          <CanvasApp />
        </CanvasControllerProvider>
      </div>
    </main>
  );
};

export default Index;
