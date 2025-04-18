
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/types/supabase';

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
      const canvasData = JSON.stringify(json) as Json;
      
      const { error } = await supabase
        .from('floor_plans')
        .upsert({
          user_id: user.id,
          name: 'My Floor Plan',
          data: canvasData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      logger.info("Canvas state saved to Supabase");
      toast.success("Drawing saved");
    }
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
      
      if (data) {
        const parsedData = typeof data.data === 'string' 
          ? JSON.parse(data.data)
          : data.data;
          
        canvasData = parsedData;
        logger.info("Loaded canvas state from Supabase");
      }
    }

    // Fall back to localStorage if no cloud data
    if (!canvasData) {
      const savedState = localStorage.getItem('canvas_objects');
      if (savedState) {
        canvasData = JSON.parse(savedState);
        logger.info("Loaded canvas state from localStorage");
      }
    }

    if (canvasData) {
      canvas.loadFromJSON(canvasData, () => {
        canvas.renderAll();
        toast.success("Drawing restored");
      });
    }
  } catch (error) {
    logger.error('Error loading canvas state:', error);
    toast.error('Failed to load saved drawing');
  }
};
