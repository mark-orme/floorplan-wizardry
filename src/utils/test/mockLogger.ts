
/**
 * Mock logger for testing
 */
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn()
};

export default mockLogger;
