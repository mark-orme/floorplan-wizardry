
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type FloorPlan = Database['public']['Tables']['floor_plans']['Row'];

export const saveCanvasState = async (canvas: FabricCanvas | null) => {
  if (!canvas) return;

  try {
    // Save to localStorage first for offline support
    const json = canvas.toJSON(['id', 'type']);
    localStorage.setItem('canvas_objects', JSON.stringify(json));
    localStorage.setItem('canvas_saved_at', new Date().toISOString());
    
    // If user is logged in, save to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // For now, save additional metadata to localStorage
      localStorage.setItem('canvas_user_id', user.id);
      localStorage.setItem('canvas_user_email', user.email || '');
      
      const { error } = await supabase
        .from('floor_plans')
        .upsert({
          user_id: user.id,
          name: 'My Floor Plan',
          data: json,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      logger.info("Canvas state saved to Supabase");
    }
    
    logger.info("Canvas state saved successfully");
  } catch (error) {
    logger.error('Error saving canvas state:', error);
    toast.error('Failed to save drawing');
  }
};

export const loadCanvasState = async (canvas: FabricCanvas | null) => {
  if (!canvas) return;

  try {
    // Try to load from Supabase first if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    let canvasData = null;

    if (user) {
      const { data, error } = await supabase
        .from('floor_plans')
        .select('data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) canvasData = data.data;
    }

    // Fall back to localStorage if no cloud data or user not logged in
    if (!canvasData) {
      const savedState = localStorage.getItem('canvas_objects');
      if (!savedState) {
        logger.info("No saved canvas state found");
        return;
      }
      canvasData = JSON.parse(savedState);
    }

    canvas.loadFromJSON(canvasData, () => {
      canvas.renderAll();
      logger.info("Canvas state restored successfully");
    });
  } catch (error) {
    logger.error('Error loading canvas state:', error);
    toast.error('Failed to load saved drawing');
  }
};
