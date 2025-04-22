
// Audio context singleton
let audioContext: AudioContext | null = null;

// Sound effect buffers
const soundEffects: { [key: string]: AudioBuffer } = {};

/**
 * Initialize audio context and load sound effects
 */
export const initializeAudio = async () => {
  try {
    audioContext = new AudioContext();
    
    // Load sketch sound effect
    const response = await fetch('/sounds/pencil-sketch.mp3');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundEffects['sketch'] = audioBuffer;
  } catch (error) {
    console.warn('Could not initialize audio:', error);
  }
};

/**
 * Play drawing feedback sounds
 */
export const playDrawingSound = (type: 'start' | 'end' | 'stroke' = 'stroke') => {
  if (!audioContext || !soundEffects['sketch']) return;

  try {
    const source = audioContext.createBufferSource();
    source.buffer = soundEffects['sketch'];
    
    // Adjust volume based on type
    const gainNode = audioContext.createGain();
    gainNode.gain.value = type === 'stroke' ? 0.1 : 0.2;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    source.start(0);
  } catch (error) {
    console.warn('Could not play sound:', error);
  }
};

/**
 * Provide haptic feedback if available
 */
export const vibrateFeedback = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * Combined feedback for drawing actions
 */
export const provideFeedback = (action: 'start' | 'end' | 'stroke' | 'collision' | number[]) => {
  if (Array.isArray(action)) {
    vibrateFeedback(action);
    return;
  }

  switch (action) {
    case 'start':
      vibrateFeedback(15);
      playDrawingSound('start');
      break;
    case 'end':
      vibrateFeedback(10);
      playDrawingSound('end');
      break;
    case 'collision':
      vibrateFeedback([10, 30, 10]);
      break;
    case 'stroke':
      playDrawingSound('stroke');
      break;
  }
};
