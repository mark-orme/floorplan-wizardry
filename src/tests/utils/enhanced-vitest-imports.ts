
/**
 * Enhanced centralized import file for Vitest utilities
 * Include this file at the top of test files ONLY
 * 
 * ⚠️ IMPORTANT: Do not import this file in non-test code!
 */

// Export these functions only when in a test environment
// This prevents errors when the app is running in development/production
export const enhancedTestUtilities = () => {
  // Only try to import vitest in a testing environment
  if (import.meta.env.MODE === 'test') {
    const vitest = require('vitest');
    const testingLibrary = require('@testing-library/react');
    
    return {
      vi: vitest.vi,
      describe: vitest.describe,
      it: vitest.it,
      expect: vitest.expect,
      beforeEach: vitest.beforeEach,
      afterEach: vitest.afterEach,
      renderHook: testingLibrary.renderHook,
      act: testingLibrary.act,
      render: testingLibrary.render,
      screen: testingLibrary.screen,
      fireEvent: testingLibrary.fireEvent,
      waitFor: testingLibrary.waitFor
    };
  }
  
  // Return mock functions when not in test mode
  return {
    vi: () => {},
    describe: () => {},
    it: () => {},
    expect: () => {},
    beforeEach: () => {},
    afterEach: () => {},
    renderHook: () => {},
    act: () => {},
    render: () => {},
    screen: () => {},
    fireEvent: () => {},
    waitFor: () => {}
  };
};

// Don't export mock utilities for Canvas and other objects directly
// They will be imported only in test files as needed
