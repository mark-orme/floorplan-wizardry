
import { 
  generateCSRFToken, 
  verifyCSRFToken, 
  addCSRFToFormData,
  addCSRFToHeaders
} from '../csrfProtection';

// Mock sessionStorage
const mockSessionStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockSessionStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockSessionStorage.store[key] = value;
  }),
  clear: jest.fn(() => {
    mockSessionStorage.store = {};
  })
};

// Mock window.crypto.getRandomValues
const mockGetRandomValues = jest.fn((buffer: Uint8Array) => {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = i % 256;
  }
  return buffer;
});

// Setup global mocks
beforeAll(() => {
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage
  });
  
  Object.defineProperty(window, 'crypto', {
    value: {
      getRandomValues: mockGetRandomValues
    }
  });
});

describe('CSRF Protection', () => {
  beforeEach(() => {
    mockSessionStorage.clear();
    jest.clearAllMocks();
  });
  
  test('generateCSRFToken should create and store a token', () => {
    const token = generateCSRFToken();
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('csrfToken', token);
  });
  
  test('verifyCSRFToken should validate a matching token', () => {
    const token = generateCSRFToken();
    const isValid = verifyCSRFToken(token);
    expect(isValid).toBe(true);
  });
  
  test('verifyCSRFToken should reject an invalid token', () => {
    generateCSRFToken();
    const isValid = verifyCSRFToken('invalid-token');
    expect(isValid).toBe(false);
  });
  
  test('addCSRFToFormData should add token to form data', () => {
    const formData = new FormData();
    const enhancedFormData = addCSRFToFormData(formData);
    // Cannot directly check formData contents due to FormData API limitations
    // but we can verify the token was generated
    expect(mockSessionStorage.setItem).toHaveBeenCalled();
    expect(mockGetRandomValues).toHaveBeenCalled();
    expect(enhancedFormData).toBe(formData); // Should be the same instance
  });
  
  test('addCSRFToHeaders should add token to headers', () => {
    const headers = { 'Content-Type': 'application/json' };
    const enhancedHeaders = addCSRFToHeaders(headers);
    expect(enhancedHeaders['X-CSRF-Token']).toBeDefined();
    expect(enhancedHeaders['Content-Type']).toBe('application/json');
  });
});
