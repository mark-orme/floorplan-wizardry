
import { Canvas } from "@/components/Canvas";
import { Button } from "@/components/ui/button";

/**
 * Main Index page component
 * Renders the Floorplan Creator application
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="py-6 px-6 border-b bg-white/50 dark:bg-black/50 backdrop-blur-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Floorplan Creator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create accurate floorplans with ease
          </p>
        </div>
        
        <Button 
          variant="destructive"
          onClick={() => {
            throw new Error("This is your first error!");
          }}
        >
          Break the world
        </Button>
      </header>
      
      <main className="min-h-[calc(100vh-120px)]">
        <Canvas />
      </main>
    </div>
  );
};

export default Index;
