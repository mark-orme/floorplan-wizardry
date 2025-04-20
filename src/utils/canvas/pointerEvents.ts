
export const vibrateFeedback = (duration: number = 10): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

export const isPointerEvent = (event: any): event is PointerEvent => {
  return 'pointerType' in event;
};

export const isPressureSupported = (): boolean => {
  return 'PointerEvent' in window && 'pressure' in PointerEvent.prototype;
};

export const isTiltSupported = (): boolean => {
  return 'PointerEvent' in window && 'tiltX' in PointerEvent.prototype && 'tiltY' in PointerEvent.prototype;
};

export const getPressure = (event: PointerEvent): number => {
  return event.pressure || 0.5;
};

export const getTilt = (event: PointerEvent): { tiltX: number; tiltY: number } => {
  return {
    tiltX: event.tiltX || 0,
    tiltY: event.tiltY || 0
  };
};
