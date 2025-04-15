/**
 * Grid Props Interface
 * @module types/hooks/useGridProps
 */
import { FabricCanvas } from "@/types/fabric";

/**
 * Interface for props related to grid functionality
 */
export interface UseGridProps {
  /**
   * Fabric canvas instance
   */
  fabricCanvas: FabricCanvas | null;
}
