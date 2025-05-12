
export interface StylusProfile {
  id: string;
  name: string;
  pressureCurve: number[];
  tiltSensitivity: number;
  stabilization: number;
  pressureMultiplier: number;
}

export const DEFAULT_STYLUS_PROFILE: StylusProfile = {
  id: 'default',
  name: 'Default',
  pressureCurve: [0, 0.25, 0.5, 0.75, 1],
  tiltSensitivity: 0.5,
  stabilization: 0.3,
  pressureMultiplier: 1
};

export const PRESETS = {
  LIGHT: {
    id: 'light',
    name: 'Light Pressure',
    pressureCurve: [0.2, 0.4, 0.6, 0.8, 1],
    tiltSensitivity: 0.3,
    stabilization: 0.5,
    pressureMultiplier: 1.2
  },
  HEAVY: {
    id: 'heavy',
    name: 'Heavy Pressure',
    pressureCurve: [0, 0.1, 0.3, 0.6, 1],
    tiltSensitivity: 0.7,
    stabilization: 0.2,
    pressureMultiplier: 0.8
  },
  LINEAR: {
    id: 'linear',
    name: 'Linear',
    pressureCurve: [0, 0.25, 0.5, 0.75, 1],
    tiltSensitivity: 0.5,
    stabilization: 0.3,
    pressureMultiplier: 1
  }
};
