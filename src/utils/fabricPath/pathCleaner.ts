
/**
 * Fabric path cleaner utility
 * Cleans up path data to ensure it's valid
 */
import { PathCommand, PATH_COMMANDS, PATH_CONSTANTS } from './types';

/**
 * Clean path data to ensure it's valid
 * @param pathData The path data to clean
 * @returns The cleaned path data
 */
export function cleanPathData(pathData: PathCommand[]): PathCommand[] {
  if (!Array.isArray(pathData) || pathData.length < PATH_CONSTANTS.MIN_PATH_LENGTH) {
    return [];
  }
  
  const cleanedPath: PathCommand[] = [];
  
  for (let i = 0; i < pathData.length; i++) {
    const command = pathData[i];
    
    // Skip empty commands
    if (!command) continue;
    
    // If it's a command string, check its validity
    if (typeof command === 'string') {
      const upperCommand = command.toUpperCase();
      
      if (Object.values(PATH_COMMANDS).includes(upperCommand as PATH_COMMANDS)) {
        cleanedPath.push(upperCommand);
      }
    }
    // If it's an array of numbers, clean and add it
    else if (Array.isArray(command)) {
      const cleanedCommand = command.map(num => {
        return typeof num === 'number' && isFinite(num) ? num : 0;
      });
      
      if (cleanedCommand.length > 0) {
        cleanedPath.push(cleanedCommand);
      }
    }
  }
  
  // Ensure path starts with a move to command
  if (cleanedPath.length >= 2 && 
      typeof cleanedPath[0] === 'string' && 
      cleanedPath[0] !== PATH_COMMANDS.MOVE_TO) {
    cleanedPath.unshift(PATH_COMMANDS.MOVE_TO);
  }
  
  return cleanedPath;
}
