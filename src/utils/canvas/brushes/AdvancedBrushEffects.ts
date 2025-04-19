
import { Point } from 'fabric';

interface BrushParameters {
  pressure: number;
  tiltX: number;
  tiltY: number;
  velocity: number;
  baseWidth: number;
  baseColor: string;
}

export class BrushEffects {
  private static readonly MIN_WIDTH_RATIO = 0.2;
  private static readonly MAX_WIDTH_RATIO = 2.5;
  private static readonly TILT_EFFECT_STRENGTH = 0.3;
  private static readonly VELOCITY_EFFECT_STRENGTH = 0.4;

  static calculateBrushWidth(params: BrushParameters): number {
    // Base width affected by pressure
    let width = params.baseWidth * (params.pressure * 1.5);
    
    // Modify by tilt - more tilt = thinner line
    const tiltFactor = Math.sqrt(params.tiltX ** 2 + params.tiltY ** 2) / 90;
    width *= (1 - (tiltFactor * this.TILT_EFFECT_STRENGTH));
    
    // Velocity affects width - faster = thinner
    const velocityFactor = Math.min(params.velocity, 1.0);
    width *= (1 - (velocityFactor * this.VELOCITY_EFFECT_STRENGTH));
    
    // Clamp within reasonable limits
    return Math.max(
      params.baseWidth * this.MIN_WIDTH_RATIO,
      Math.min(width, params.baseWidth * this.MAX_WIDTH_RATIO)
    );
  }

  static calculateBrushOpacity(params: BrushParameters): number {
    // Pressure affects opacity
    let opacity = params.pressure * 0.8 + 0.2; // Never fully transparent
    
    // Faster strokes are more transparent
    opacity *= (1 - (Math.min(params.velocity, 1.0) * 0.3));
    
    return Math.min(Math.max(opacity, 0.1), 1.0);
  }

  static calculateBrushColor(params: BrushParameters): string {
    // Parse the base color
    const r = parseInt(params.baseColor.slice(1, 3), 16);
    const g = parseInt(params.baseColor.slice(3, 5), 16);
    const b = parseInt(params.baseColor.slice(5, 7), 16);
    
    // Modify color based on tilt direction
    const tiltAngle = Math.atan2(params.tiltY, params.tiltX);
    const tiltFactor = Math.sqrt(params.tiltX ** 2 + params.tiltY ** 2) / 90;
    
    // Add subtle color variation based on tilt
    const rMod = Math.sin(tiltAngle) * 20 * tiltFactor;
    const gMod = Math.cos(tiltAngle) * 20 * tiltFactor;
    const bMod = (Math.sin(tiltAngle + Math.PI/4) * 20 * tiltFactor);
    
    // Clamp values
    const newR = Math.min(255, Math.max(0, r + rMod));
    const newG = Math.min(255, Math.max(0, g + gMod));
    const newB = Math.min(255, Math.max(0, b + bMod));
    
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${
      Math.round(newG).toString(16).padStart(2, '0')}${
      Math.round(newB).toString(16).padStart(2, '0')}`;
  }
}
