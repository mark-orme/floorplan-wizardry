
export const vibrateFeedback = (duration: number = 10): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

export const isPointerEvent = (event: any): event is PointerEvent => {
  return 'pointerType' in event;
};
