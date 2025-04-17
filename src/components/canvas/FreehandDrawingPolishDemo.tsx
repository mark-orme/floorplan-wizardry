
const handleCloseGuide = useCallback(() => {
  setShowGuide(false);
  
  // Optional: Add logic to store preference if needed
  // localStorage.setItem('dontShowMeasurementGuide', 'true');
}, []);
