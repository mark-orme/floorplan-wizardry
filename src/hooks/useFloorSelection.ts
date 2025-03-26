
/**
 * Custom hook for floor selection functionality
 * Provides floor selection handler with state management
 * @module useFloorSelection
 */
import { useCallback } from "react";

/**
 * Props for useFloorSelection hook
 * @interface UseFloorSelectionProps
 */
interface UseFloorSelectionProps {
  /** Currently selected floor index */
  currentFloor: number;
  /** State setter for the current floor */
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  /** Handler function when a floor is selected */
  handleSelectFloor: (index: number) => void;
}

/**
 * Hook for managing floor selection
 * Provides a centralized handler for changing the selected floor
 * 
 * @param {UseFloorSelectionProps} props - Hook properties
 * @returns {Object} Floor selection handler
 * 
 * @example
 * const { handleFloorSelect } = useFloorSelection({
 *   currentFloor,
 *   setCurrentFloor,
 *   handleSelectFloor
 * });
 */
export const useFloorSelection = ({
  currentFloor,
  setCurrentFloor,
  handleSelectFloor
}: UseFloorSelectionProps) => {
  /**
   * Handle selecting a different floor
   * Updates state and calls the provided handler
   * 
   * @param {number} index - Index of the floor to select
   */
  const handleFloorSelect = useCallback((index: number) => {
    if (index !== currentFloor) {
      setCurrentFloor(index);
      handleSelectFloor(index);
    }
  }, [currentFloor, handleSelectFloor, setCurrentFloor]);

  return { handleFloorSelect };
};
