
/**
 * Custom hook for floor selection functionality
 * @module useFloorSelection
 */
import { useCallback } from "react";

interface UseFloorSelectionProps {
  currentFloor: number;
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  handleSelectFloor: (index: number) => void;
}

/**
 * Hook for managing floor selection
 * @param {UseFloorSelectionProps} props - Hook properties
 * @returns Floor selection handler
 */
export const useFloorSelection = ({
  currentFloor,
  setCurrentFloor,
  handleSelectFloor
}: UseFloorSelectionProps) => {
  // Handle selecting a different floor
  const handleFloorSelect = useCallback((index: number) => {
    if (index !== currentFloor) {
      setCurrentFloor(index);
      handleSelectFloor(index);
    }
  }, [currentFloor, handleSelectFloor, setCurrentFloor]);

  return { handleFloorSelect };
};
