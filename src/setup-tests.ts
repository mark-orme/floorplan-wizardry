
// This file will be executed before each test file runs
// It sets up the global Jest test environment without modifying tsconfig

// If Jest globals aren't detected properly, we explicitly declare them here
// This prevents TypeScript errors without needing to modify tsconfig.json
declare global {
  namespace jest {
    interface Describe {
      (name: string, fn: () => void): void;
      only: (name: string, fn: () => void) => void;
      skip: (name: string, fn: () => void) => void;
    }
    
    interface It {
      (name: string, fn: () => void): void;
      only: (name: string, fn: () => void) => void;
      skip: (name: string, fn: () => void) => void;
    }
    
    interface Expect {
      (value: any): any;
    }
    
    interface Lifecycle {
      (fn: () => void): void;
    }
  }
}

// Create a stub for Node.js process if running in browser environment
if (typeof window !== 'undefined' && !window.process) {
  (window as any).process = {
    env: {
      NODE_ENV: 'test'
    }
  };
}

export {};
