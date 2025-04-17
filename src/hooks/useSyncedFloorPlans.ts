/**
 * Hook for syncing floor plans between canvas and state
 * This hook provides persistence and synchronization for floor plans
 * @module hooks/useSyncedFloorPlans
 */
import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";
import { toast } from "sonner";
import { serializeCanvasState } from '@/utils/canvas/canvasSerializer';

/**
 * Hook to synchronize floor plans with the canvas and localStorage
 * 
 * Provides state management for floor plans along with persistence
 * through localStorage and canvas integration capabilities
 * 
 * @returns {Object} Functions and state for floor plan synchronization
 */
export const useSyncedFloorPlans = () => {
  // State to track floor plans across the application
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  
  // Initial loading of floor plans when component mounts
  useEffect(() => {
    console.log("Initializing synced floor plans");
    
    // Load floor plans from storage if available
    loadData();
  }, []);
  
  /**
   * Load floor plans from localStorage
   * 
   * @returns {Promise<FloorPlan[]>} Promise that resolves to the loaded floor plans
   */
  const loadData = useCallback(async (): Promise<FloorPlan[]> => {
    try {
      // Try to load from localStorage first
      const storedData = localStorage.getItem('floorPlans');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Loaded floor plans from storage:", parsedData);
        setFloorPlans(parsedData);
        return parsedData;
      }
      
      console.log("No stored floor plans found");
      return [];
    } catch (error) {
      console.error("Error loading floor plans:", error);
      toast.error("Failed to load floor plans");
      return [];
    }
  }, []);
  
  /**
   * Save floor plans to localStorage
   * 
   * @param {FloorPlan[]} updatedFloorPlans - Floor plans to save
   * @returns {Promise<boolean>} Promise that resolves to success status
   */
  const saveData = useCallback(async (updatedFloorPlans: FloorPlan[]): Promise<boolean> => {
    try {
      localStorage.setItem('floorPlans', JSON.stringify(updatedFloorPlans));
      setFloorPlans(updatedFloorPlans);
      console.log("Floor plans saved to storage");
      return true;
    } catch (error) {
      console.error("Error saving floor plans:", error);
      toast.error("Failed to save floor plans");
      return false;
    }
  }, []);

  const saveFloorPlan = useCallback((canvas: FabricCanvas): FloorPlan | null => {
    try {
      const serializedState = serializeCanvasState(canvas);
      
      if (!serializedState) {
        throw new Error('Failed to serialize canvas state');
      }
      
      const newFloorPlan: FloorPlan = {
        id: `floor-${Date.now()}`,
        name: `Floor ${floorPlans.length + 1}`,
        label: `Floor ${floorPlans.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: floorPlans.length,
        canvasState: serializedState,
        walls: [],
        rooms: [],
        strokes: [],
        canvasData: null,
        canvasJson: null,
        gia: 0,
        level: floorPlans.length,
        index: floorPlans.length,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paperSize: 'A4',
          level: floorPlans.length
        }
      };
      
      setFloorPlans(prev => [...prev, newFloorPlan]);
      toast.success('Floor plan saved successfully');
      
      return newFloorPlan;
    } catch (error) {
      console.error('Error saving floor plan:', error);
      toast.error('Failed to save floor plan');
      return null;
    }
  }, [floorPlans, setFloorPlans]);
  
  return {
    // State setters and getters
    floorPlans,
    setFloorPlans,
    loadData,
    
    // Canvas integration functions
    /**
     * Synchronizes floor plans with the canvas
     * 
     * @param {FabricCanvas} canvas - The fabric canvas to sync with
     * @param {FloorPlan[]} floorPlans - Floor plans to sync to canvas
     */
    syncFloorPlans: (canvas: FabricCanvas, floorPlans: FloorPlan[]) => {
      console.log("Syncing floor plans with canvas:", floorPlans.length);
      // Implementation would sync floor plans with canvas
    },
    
    /**
     * Loads a single floor plan to the canvas
     * 
     * @param {FabricCanvas} canvas - The fabric canvas to load to
     * @param {FloorPlan} floorPlan - Floor plan to load
     */
    loadFloorPlan: (canvas: FabricCanvas, floorPlan: FloorPlan) => {
      console.log("Loading floor plan to canvas:", floorPlan.id);
      // Implementation would load a floor plan to canvas
    },
    
    /**
     * Saves current canvas state to a floor plan
     * 
     * @param {FabricCanvas} canvas - The fabric canvas to save from
     * @returns {FloorPlan|null} The saved floor plan or null on failure
     */
    saveFloorPlan,
    
    /**
     * Calculates Gross Internal Area from floor plans
     * 
     * @param {FloorPlan[]} floorPlans - Floor plans to calculate GIA from
     * @returns {number} The calculated GIA value
     */
    calculateGIA: (floorPlans: FloorPlan[]): number => {
      // Implementation would calculate GIA from floor plans
      return 0;
    }
  };
};
