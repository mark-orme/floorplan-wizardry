
/**
 * Custom hook for floor plan storage operations with encryption
 * @module useFloorPlanStorage
 */
import { useCallback, useState, useEffect } from "react";
import { FloorPlan } from "@/types/floorPlan";
import { useAuth } from "@/contexts/AuthContext";
import { 
  saveEncryptedCanvas, 
  loadEncryptedCanvas, 
  clearEncryptedCanvas 
} from "@/utils/storage/encryptedCanvasStore";
import { toast } from "sonner";

/**
 * Hook for managing floor plan data storage with encryption
 * @returns {Object} Floor plan storage functions and state
 */
export const useFloorPlanStorage = () => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  /**
   * Load floor plan data from secure storage
   * @returns {Promise<FloorPlan[]>} Loaded floor plans or empty array
   */
  const loadData = useCallback(async (): Promise<FloorPlan[]> => {
    try {
      // Try to load encrypted data first
      const encryptedData = await loadEncryptedCanvas('floorPlans');
      
      if (encryptedData) {
        console.log("Loaded encrypted floor plans from storage");
        return encryptedData;
      }
      
      // Fallback to local storage if needed
      const storedData = localStorage.getItem('floorPlans');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Loaded floor plans from localStorage (unencrypted)");
        
        // Migrate data to encrypted storage for next time
        saveEncryptedCanvas('floorPlans', parsedData)
          .then(() => {
            console.log("Migrated floor plans to encrypted storage");
            // Clear unencrypted data
            localStorage.removeItem('floorPlans');
          })
          .catch(error => {
            console.error("Failed to migrate floor plans to encrypted storage:", error);
          });
          
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
   * Save floor plan data to secure storage
   * @param {FloorPlan[]} floorPlans - Floor plans to save
   * @returns {Promise<boolean>} Success state
   */
  const saveData = useCallback(async (floorPlans: FloorPlan[]): Promise<boolean> => {
    try {
      setIsSaving(true);
      
      // Save with encryption
      const success = await saveEncryptedCanvas('floorPlans', floorPlans);
      
      if (success) {
        console.log("Floor plans saved to encrypted storage");
        const now = new Date();
        setLastSaved(now);
        localStorage.setItem('floorPlansLastSaved', JSON.stringify(now.toISOString()));
        return true;
      } else {
        // Fallback to localStorage if encryption fails
        console.warn("Encrypted storage failed, falling back to localStorage");
        localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
        const now = new Date();
        setLastSaved(now);
        localStorage.setItem('floorPlansLastSaved', JSON.stringify(now.toISOString()));
        return true;
      }
    } catch (error) {
      console.error("Error saving floor plans:", error);
      toast.error("Failed to save floor plans");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Clear all floor plan data
   * @returns {Promise<boolean>} Success state
   */
  const clearData = useCallback(async (): Promise<boolean> => {
    try {
      // Clear encrypted data
      await clearEncryptedCanvas('floorPlans');
      
      // Also clear from localStorage for migration purposes
      localStorage.removeItem('floorPlans');
      localStorage.removeItem('floorPlansLastSaved');
      
      setLastSaved(null);
      return true;
    } catch (error) {
      console.error("Error clearing floor plans:", error);
      return false;
    }
  }, []);

  // Update lastSaved from localStorage on mount
  useEffect(() => {
    const timestamp = localStorage.getItem('floorPlansLastSaved');
    if (timestamp) {
      try {
        setLastSaved(new Date(JSON.parse(timestamp)));
      } catch (e) {
        console.error("Error parsing last saved timestamp:", e);
      }
    }
  }, []);

  return {
    loadData,
    saveData,
    clearData,
    lastSaved,
    isLoggedIn,
    isSaving
  };
};
