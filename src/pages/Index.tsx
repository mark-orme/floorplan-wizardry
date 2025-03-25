
import { Canvas } from "@/components/Canvas";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePusher } from "@/hooks/usePusher";
import { toast } from "sonner";
import { subscribeSyncChannel } from "@/utils/syncService";

/**
 * Main Index page component
 * Renders the Floorplan Creator application
 */
const Index = () => {
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  // Set up Pusher connection to the main channel
  const { isConnected, triggerEvent } = usePusher({
    channelName: 'floorplan-updates',
    events: {
      'new-update': (data: any) => {
        setLastEvent(JSON.stringify(data));
        toast.info(`Received update: ${data.message}`);
      }
    }
  });

  // Set up sync channel connection
  useEffect(() => {
    const syncChannel = subscribeSyncChannel();
    
    const handleSubscriptionSuccess = () => {
      setSyncStatus('connected');
      toast.success('Floor plan sync connected');
    };
    
    const handleDisconnection = () => {
      setSyncStatus('disconnected');
    };
    
    syncChannel.bind('pusher:subscription_succeeded', handleSubscriptionSuccess);
    syncChannel.bind('pusher:subscription_error', handleDisconnection);
    
    return () => {
      syncChannel.unbind('pusher:subscription_succeeded', handleSubscriptionSuccess);
      syncChannel.unbind('pusher:subscription_error', handleDisconnection);
    };
  }, []);

  // Test Pusher connection
  const testPusherConnection = () => {
    triggerEvent('new-update', { 
      message: 'Test message', 
      timestamp: new Date().toISOString() 
    });
  };

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
        
        <div className="flex gap-2">
          <div className="flex items-center mr-4">
            <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="flex items-center mr-4">
            <span className={`h-2 w-2 rounded-full mr-2 ${
              syncStatus === 'connected' ? 'bg-green-500' : 
              syncStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sync: {syncStatus}
            </span>
          </div>
          
          <Button 
            onClick={testPusherConnection}
            className="mr-2"
          >
            Test Pusher
          </Button>
          
          <Button 
            variant="destructive"
            onClick={() => {
              throw new Error("This is your first error!");
            }}
          >
            Break the world
          </Button>
        </div>
      </header>
      
      {lastEvent && (
        <div className="bg-green-100 dark:bg-green-900 p-2 text-xs">
          Last event: {lastEvent}
        </div>
      )}
      
      <main className="min-h-[calc(100vh-120px)]">
        <Canvas />
      </main>
    </div>
  );
};

export default Index;
