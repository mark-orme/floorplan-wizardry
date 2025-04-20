
/**
 * Creates a mock canvas test utility
 * @returns Canvas test utilities
 */
export function createCanvasTestUtils() {
  return {
    getMouseEvent: (type: string, x: number, y: number) => {
      return {
        type,
        clientX: x,
        clientY: y,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      };
    },
    triggerMouseEvent: (element: HTMLElement, type: string, x: number, y: number) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      element.dispatchEvent(event);
      return event;
    }
  };
}
