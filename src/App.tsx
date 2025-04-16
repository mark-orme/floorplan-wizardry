
import React from "react";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { FloorPlanEditor } from "@/components/FloorPlanEditor";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <DrawingProvider>
        <div className="min-h-screen flex flex-col">
          <header className="bg-primary text-primary-foreground p-4">
            <h1 className="text-xl font-bold">Floor Plan Drawing Tool</h1>
          </header>
          <main className="flex-1 overflow-hidden">
            <FloorPlanEditor />
          </main>
        </div>
        <Toaster />
      </DrawingProvider>
    </ThemeProvider>
  );
}

export default App;
