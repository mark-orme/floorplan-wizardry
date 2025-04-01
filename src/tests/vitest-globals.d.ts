
import { MockInstance } from 'vitest';

// Define vi extension for Window
interface Window {
  vi: typeof import('vitest')['vi'];
}
