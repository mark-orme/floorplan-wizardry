
/**
 * Convert a past date to a human-readable string
 * @param date The past date
 * @returns Human-readable time elapsed string
 */
export const getTimeElapsedString = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return `${diffSec} seconds`;
  }
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''}`;
  }
  
  // Convert to hours
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''}`;
  }
  
  // Convert to days
  const diffDay = Math.floor(diffHour / 24);
  
  return `${diffDay} day${diffDay !== 1 ? 's' : ''}`;
};
