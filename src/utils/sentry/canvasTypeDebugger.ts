
import { captureError, captureMessage } from '@/utils/sentry';
import { validateCanvasMock } from '@/utils/debug/typeDiagnostics';

/**
 * Debug Fabric.js mock implementations
 * Helps identify type issues with canvas mocks
 * @param mockName Name of the mock being debugged
 * @param mockImpl The mock implementation
 */
export function debugCanvasMock(mockName: string, mockImpl: any): void {
  console.log(`Debugging canvas mock: ${mockName}`);
  
  // Validate the mock
  const { valid, errors } = validateCanvasMock(mockImpl);
  
  if (!valid) {
    console.error(`Invalid canvas mock (${mockName}):`, errors);
    
    captureMessage(`Invalid canvas mock: ${mockName}`, 'canvas-mock-validation', {
      level: 'error',
      tags: {
        component: 'testing',
        mockName
      },
      extra: {
        errors,
        mockImplementation: JSON.stringify(mockImpl, (key, value) => {
          if (typeof value === 'function') {
            return `[Function: ${value.name || 'anonymous'}]`;
          }
          return value;
        }, 2)
      }
    });
  } else {
    console.log(`Canvas mock ${mockName} is valid`);
  }
  
  // Test withImplementation specifically
  try {
    const result = mockImpl.withImplementation(() => {
      console.log('withImplementation callback executed');
      return 'test-result';
    });
    
    console.log('withImplementation return type:', result);
    
    if (result instanceof Promise) {
      result.then(value => {
        console.log('withImplementation promise resolved with:', value);
      }).catch(err => {
        console.error('withImplementation promise rejected:', err);
      });
    } else {
      console.error('withImplementation did not return a Promise');
    }
  } catch (error) {
    console.error('Error testing withImplementation:', error);
    
    captureError(error, 'canvas-mock-withImplementation-error', {
      level: 'error',
      tags: {
        component: 'testing',
        mockName
      }
    });
  }
}

/**
 * Report fabric objects type mismatches
 * @param objectType Type of object (e.g., 'Stroke', 'Room')
 * @param object The actual object instance
 */
export function reportFabricObjectTypeMismatch(objectType: string, object: any): void {
  // Extract only safe properties for logging
  const safeProps = Object.keys(object || {}).reduce((acc, key) => {
    if (typeof object[key] !== 'function' && key !== 'canvas') {
      acc[key] = object[key];
    }
    return acc;
  }, {} as Record<string, any>);
  
  captureMessage(`Type mismatch for ${objectType}`, 'object-type-mismatch', {
    level: 'warning',
    tags: {
      component: 'fabric',
      objectType
    },
    extra: {
      objectProperties: safeProps,
      hasRequiredProperties: safeProps.id !== undefined, // Basic check
      propertiesPresent: Object.keys(safeProps)
    }
  });
}
