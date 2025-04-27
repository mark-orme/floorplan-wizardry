
// Add type safety for the .visible property
export const checkGridVisibility = (gridObject: any) => {
  // Using type assertion to safely access the visible property
  return gridObject && typeof gridObject.visible !== 'undefined' 
    ? gridObject.visible 
    : false;
};

// Update the function causing the error to use the safe check
export const monitorGridState = (gridObjects: any[]) => {
  const visibleCount = gridObjects.filter(obj => 
    // Use type-safe access
    obj && typeof obj === 'object' && obj.visible === true
  ).length;
  
  return {
    total: gridObjects.length,
    visible: visibleCount
  };
};
