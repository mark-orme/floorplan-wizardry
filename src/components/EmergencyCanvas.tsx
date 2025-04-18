
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';

interface EmergencyCanvasProps {
  onRetry?: () => void;
  error?: Error;
}

export const EmergencyCanvas: React.FC<EmergencyCanvasProps> = ({
  onRetry,
  error
}) => {
  const handleRetry = () => {
    toast.info("Retrying canvas initialization...");
    onRetry?.();
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-red-600">Canvas Error</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error?.message || "The canvas encountered an error and couldn't be loaded."}
          </p>
          <Button 
            onClick={handleRetry}
            className="w-full"
            variant="outline"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry Loading Canvas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

