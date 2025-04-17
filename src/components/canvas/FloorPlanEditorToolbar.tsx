
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  trackCanvasOperation, 
  trackUserInteraction, 
  InteractionCategory 
} from "@/utils/sentry/userInteractions";
import { startPerformanceTransaction } from "@/utils/sentry/performance";
import logger from "@/utils/logger";
import { toast } from "sonner";
import { Canvas as FabricCanvas } from "fabric";

interface FloorPlanEditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const FloorPlanEditorToolbarWithToast = ({
  onUndo,
  onRedo,
  onClear,
  onSave,
  canUndo,
  canRedo
}: FloorPlanEditorToolbarProps) => {
  const handleUndo = () => {
    const perfTransaction = startPerformanceTransaction('canvas.undo', null);
    
    try {
      onUndo();
      perfTransaction.finish('ok');
    } catch (error) {
      logger.error("Error performing undo:", error);
      perfTransaction.finish('error');
    }
  };

  const handleRedo = () => {
    const perfTransaction = startPerformanceTransaction('canvas.redo', null);
    
    try {
      onRedo();
      perfTransaction.finish('ok');
    } catch (error) {
      logger.error("Error performing redo:", error);
      perfTransaction.finish('error');
    }
  };

  const handleClear = () => {
    const perfTransaction = startPerformanceTransaction('canvas.clear', null);
    
    try {
      const objectCountBefore = 0; // This would need to be passed in if needed
      
      onClear();
      
      trackCanvasOperation('cleared', {
        objectCountBefore,
        objectCountAfter: 0 // This would need to be updated based on the canvas state
      });
      
      toast.success("Canvas cleared");
      logger.info("Canvas cleared by user");
      
      perfTransaction.finish('ok');
    } catch (error) {
      logger.error("Error clearing canvas:", error);
      perfTransaction.finish('error');
    }
  };

  const handleSave = () => {
    const transaction = startPerformanceTransaction('canvas.save', null);
    
    try {
      onSave();
      
      trackCanvasOperation('saved', {
        objectCount: 0, // This would need to be updated based on the canvas state
        timestamp: new Date().toISOString()
      });
      
      toast.success("Canvas saved");
      logger.info("Canvas state saved");
      
      transaction.finish('ok');
    } catch (error) {
      logger.error("Error saving canvas:", error);
      toast.error("Failed to save canvas");
      
      transaction.finish('error');
    }
  };

  return (
    <DrawingToolbar
      onUndo={handleUndo}
      onRedo={handleRedo}
      onClear={handleClear}
      onSave={handleSave}
      canUndo={canUndo}
      canRedo={canRedo}
    />
  );
};

// Import the DrawingToolbar component to forward operations
import { DrawingToolbar } from "../DrawingToolbar";

// Export the FloorPlanEditorToolbar component
export const FloorPlanEditorToolbar = FloorPlanEditorToolbarWithToast;
