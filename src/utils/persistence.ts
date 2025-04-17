
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

export const saveCanvasState = async (canvas: FabricCanvas | null) => {
  if (!canvas) return;

  try {
    // Save to localStorage first for offline support
    const json = canvas.toJSON(['id', 'type']);
    localStorage.setItem('canvas_objects', JSON.stringify(json));
    localStorage.setItem('canvas_saved_at', new Date().toISOString());
    
    // If user is logged in, save to Supabase
    // Currently we aren't using Supabase for persistence as the floor_plans table
    // hasn't been created yet in the database schema
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // For now, save additional metadata to localStorage
      localStorage.setItem('canvas_user_id', user.id);
      localStorage.setItem('canvas_user_email', user.email || '');
      
      // Log that we would save to Supabase in the future
      logger.info("User is logged in. Would save to Supabase if table existed.");
    }
    
    logger.info("Canvas state saved successfully to localStorage");
  } catch (error) {
    logger.error('Error saving canvas state:', error);
    toast.error('Failed to save drawing');
  }
};

export const loadCanvasState = async (canvas: FabricCanvas | null) => {
  if (!canvas) return;

  try {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    let canvasData = null;

    // Currently not loading from Supabase since the floor_plans table 
    // doesn't exist in the schema yet
    if (user) {
      logger.info("User is logged in. Would load from Supabase if table existed.");
    }

    // Load from localStorage
    const savedState = localStorage.getItem('canvas_objects');
    if (!savedState) {
      logger.info("No saved canvas state found");
      return;
    }
    
    canvasData = JSON.parse(savedState);
    
    canvas.loadFromJSON(canvasData, () => {
      canvas.renderAll();
      logger.info("Canvas state restored successfully from localStorage");
    });
  } catch (error) {
    logger.error('Error loading canvas state:', error);
    toast.error('Failed to load saved drawing');
  }
};
