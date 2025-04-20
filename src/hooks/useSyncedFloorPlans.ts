import { useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { FloorPlan } from '@/types/floorPlanTypes';
import { adaptFloorPlan } from '@/utils/floorPlanAdapter';

export const useSyncedFloorPlans = () => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFloorPlans = useCallback(async () => {
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('userId', user.id)
        .order('order', { ascending: true });

      if (error) {
        console.error("Error fetching floor plans:", error);
        setError(error.message);
      } else {
        const adaptedFloorPlans = data.map(adaptFloorPlan);
        setFloorPlans(adaptedFloorPlans);
      }
    } catch (err: any) {
      console.error("Unexpected error fetching floor plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    fetchFloorPlans();
  }, [fetchFloorPlans]);

  useEffect(() => {
    if (!supabase || !user) return;

    const channel = supabase
      .channel('public:floor_plans')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'floor_plans' },
        (payload) => {
          console.log('Change received!', payload);
          fetchFloorPlans();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, fetchFloorPlans]);

  const createFloorPlan = useCallback((data: any) => {
    const newFloorPlan = adaptFloorPlan({
      id: data.id || uuid(),
      name: data.name || 'New Floor Plan',
      label: data.label || data.name || 'New Floor Plan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: data.order || floorPlans.length,
      canvasState: data.canvasState || {},
      walls: [],
      rooms: [],
      strokes: [],
      canvasData: null,
      canvasJson: null,
      gia: 0,
      level: data.level || 0,
      index: data.level || 0,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paperSize: 'A4',
        level: data.level || 0
      }
    });
    
    return newFloorPlan;
  }, [floorPlans.length]);

  const addFloorPlan = useCallback(async () => {
    if (!supabase || !user) return;

    const newFloorPlan = createFloorPlan({});

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .insert([
          {
            ...newFloorPlan,
            userId: user.id,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding floor plan:", error);
        setError(error.message);
      } else if (data && data.length > 0) {
        const addedFloorPlan = adaptFloorPlan(data[0]);
        setFloorPlans([...floorPlans, addedFloorPlan]);
      }
    } catch (err: any) {
      console.error("Unexpected error adding floor plan:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, user, floorPlans, createFloorPlan]);

  const updateFloorPlan = useCallback(async (floorPlanId: string, updates: any) => {
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .update(updates)
        .eq('id', floorPlanId)
        .select();

      if (error) {
        console.error("Error updating floor plan:", error);
        setError(error.message);
      } else if (data && data.length > 0) {
        const updatedFloorPlan = adaptFloorPlan(data[0]);
        setFloorPlans(floorPlans.map((fp) => (fp.id === floorPlanId ? updatedFloorPlan : fp)));
      }
    } catch (err: any) {
      console.error("Unexpected error updating floor plan:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, user, floorPlans]);

  const deleteFloorPlan = useCallback(async (floorPlanId: string) => {
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', floorPlanId);

      if (error) {
        console.error("Error deleting floor plan:", error);
        setError(error.message);
      } else {
        setFloorPlans(floorPlans.filter((fp) => fp.id !== floorPlanId));
      }
    } catch (err: any) {
      console.error("Unexpected error deleting floor plan:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, user, floorPlans]);

  const reorderFloorPlans = useCallback(async (newOrder: { id: string; order: number }[]) => {
    if (!supabase || !user) return;
  
    setLoading(true);
    try {
      // Create an array of promises for each update
      const updates = newOrder.map(item =>
        supabase
          .from('floor_plans')
          .update({ order: item.order })
          .eq('id', item.id)
      );
  
      // Execute all updates in parallel
      const results = await Promise.all(updates);
  
      // Check for errors in any of the updates
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error("Error reordering floor plans:", errors);
        setError("Failed to reorder floor plans");
      } else {
        // Optimistically update the local state
        setFloorPlans(prevFloorPlans => {
          return prevFloorPlans.map(fp => {
            const newOrderItem = newOrder.find(item => item.id === fp.id);
            if (newOrderItem) {
              return { ...fp, order: newOrderItem.order };
            }
            return fp;
          }).sort((a, b) => a.order - b.order);
        });
      }
    } catch (err: any) {
      console.error("Unexpected error reordering floor plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  return {
    floorPlans,
    isLoading,
    error,
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    reorderFloorPlans,
    fetchFloorPlans,
    createFloorPlan
  };
};
