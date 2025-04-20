
/**
 * Creates a mock history reference with optional past and future states
 * @param past Optional past states
 * @param future Optional future states
 * @returns Mock history reference
 */
export function createMockHistoryRef(past: any[][] = [], future: any[][] = []) {
  return {
    current: {
      past: [...past],
      future: [...future]
    }
  };
}
