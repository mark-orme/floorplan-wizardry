
/**
 * Grid error handlers
 * @module utils/grid/errorHandlers
 */
import { GridErrorSeverity, categorizeGridError } from "./errorTypes";
import logger from "@/utils/logger";

/**
 * Handle grid creation error
 * 
 * @param {Error} error - The error to handle
 * @returns {boolean} Whether error was handled
 */
export const handleGridCreationError = (error: Error): boolean => {
  try {
    const severity = categorizeGridError(error);
    
    // Log with appropriate level
    switch (severity) {
      case GridErrorSeverity.CRITICAL:
        logger.error("Critical grid creation error:", error);
        return false;
        
      case GridErrorSeverity.HIGH:
        logger.error("Grid creation error:", error);
        return false;
        
      case GridErrorSeverity.MEDIUM:
        logger.warn("Grid creation warning:", error);
        return true;
        
      case GridErrorSeverity.LOW:
      default:
        logger.info("Grid creation issue:", error);
        return true;
    }
  } catch (handlerError) {
    logger.error("Error in grid error handler:", handlerError);
    return false;
  }
};
