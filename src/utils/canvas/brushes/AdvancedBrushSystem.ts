
import { Point } from '@/types/core/Geometry';

interface BrushParameters {
  pressure: number;
  tiltX: number;
  tiltY: number;
  velocity: number;
  width: number;
  color: string;
}

export class AdvancedBrushSystem {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private program: WebGLProgram;
  private vertexBuffer: WebGLBuffer | null = null;
  private currentParameters: BrushParameters;
  private maxPoints = 100; // Maximum number of points to interpolate between
  private interpolationStep = 0.05; // Step for bezier interpolation

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this.gl = gl;
    this.program = this.createShaderProgram();
    this.setupBuffers();
    
    this.currentParameters = {
      pressure: 1.0,
      tiltX: 0,
      tiltY: 0,
      velocity: 0,
      width: 2,
      color: '#000000'
    };
  }

  private createShaderProgram(): WebGLProgram {
    const vertexShaderSource = `
      attribute vec2 aPosition;
      uniform vec2 uBrushPos;
      uniform float uSize;
      uniform float uPressure;
      uniform vec2 uTilt;
      
      varying vec2 vTexCoord;
      
      void main() {
        // Apply pressure and tilt to vertex position
        vec2 pos = aPosition * uSize * (0.5 + uPressure * 0.5);
        pos += uBrushPos;
        
        // Apply tilt effect
        float tiltMagnitude = length(uTilt);
        mat2 tiltRotation = mat2(
          cos(tiltMagnitude), -sin(tiltMagnitude),
          sin(tiltMagnitude), cos(tiltMagnitude)
        );
        pos = tiltRotation * pos;
        
        // Transform from canvas to clip space
        pos = pos * 2.0 - 1.0;
        
        gl_Position = vec4(pos, 0.0, 1.0);
        vTexCoord = aPosition;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec4 uColor;
      uniform float uPressure;
      uniform float uVelocity;
      
      varying vec2 vTexCoord;
      
      float gaussian(float x, float sigma) {
        return exp(-(x * x) / (2.0 * sigma * sigma));
      }
      
      void main() {
        // Calculate distance from center
        float dist = length(vTexCoord);
        
        // Create soft brush edge with gaussian falloff
        float sigma = 0.3; // Controls brush softness
        float alpha = gaussian(dist, sigma);
        
        // Apply pressure and velocity effects
        alpha *= uPressure * (1.0 - uVelocity * 0.5);
        
        // Output final color
        gl_FragColor = uColor * alpha;
      }
    `;

    const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);

    const program = this.gl.createProgram();
    if (!program) throw new Error('Failed to create shader program');

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error('Failed to link shader program');
    }

    return program;
  }

  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      throw new Error('Shader compilation failed: ' + info);
    }

    return shader;
  }

  private setupBuffers(): void {
    // Create a buffer for brush vertices (simple quad)
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Quad vertices with more detail for better quality
    const vertices = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1
    ]);
    
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
  }

  public updateParameters(params: Partial<BrushParameters>): void {
    this.currentParameters = { ...this.currentParameters, ...params };
  }

  public drawStroke(point: Point, prevPoint: Point | null): void {
    if (!prevPoint) {
      // Draw a single dot when starting a stroke
      this.drawDot(point);
      return;
    }

    // Get interpolated points for smooth stroke
    const interpolatedPoints = this.getInterpolatedPoints(prevPoint, point);
    
    // Draw segments between interpolated points
    for (let i = 0; i < interpolatedPoints.length; i++) {
      // Calculate t value for parameter interpolation
      const t = i / (interpolatedPoints.length - 1);
      
      // Interpolate parameters along the stroke
      const currentPressure = this.lerpValue(
        this.currentParameters.pressure, 
        this.currentParameters.pressure, 
        t
      );
      
      const currentSize = this.currentParameters.width * (1 + (this.currentParameters.tiltX + this.currentParameters.tiltY) * 0.1);
      
      // Draw the current point with interpolated parameters
      this.drawDot(
        interpolatedPoints[i], 
        currentPressure, 
        currentSize
      );
    }
  }

  private drawDot(point: Point, pressure?: number, size?: number): void {
    this.gl.useProgram(this.program);

    // Set uniforms
    const posLoc = this.gl.getUniformLocation(this.program, 'uBrushPos');
    const sizeLoc = this.gl.getUniformLocation(this.program, 'uSize');
    const pressureLoc = this.gl.getUniformLocation(this.program, 'uPressure');
    const tiltLoc = this.gl.getUniformLocation(this.program, 'uTilt');
    const colorLoc = this.gl.getUniformLocation(this.program, 'uColor');
    const velocityLoc = this.gl.getUniformLocation(this.program, 'uVelocity');

    // Normalize coordinates to WebGL coordinate space (0.0-1.0)
    const canvas = this.gl.canvas;
    const normalizedX = point.x / canvas.width;
    const normalizedY = point.y / canvas.height;

    // Convert color from hex to RGB
    const color = this.hexToRgb(this.currentParameters.color);

    // Use provided parameters or fall back to current parameters
    const usePressure = pressure !== undefined ? pressure : this.currentParameters.pressure;
    const useSize = size !== undefined ? size : this.currentParameters.width;

    this.gl.uniform2f(posLoc, normalizedX, normalizedY);
    this.gl.uniform1f(sizeLoc, useSize / 100.0); // Normalize size
    this.gl.uniform1f(pressureLoc, usePressure);
    this.gl.uniform2f(tiltLoc, this.currentParameters.tiltX / 90.0, this.currentParameters.tiltY / 90.0);
    this.gl.uniform4f(colorLoc, color.r, color.g, color.b, 1.0);
    this.gl.uniform1f(velocityLoc, this.currentParameters.velocity);

    // Draw the brush stroke
    const positionLoc = this.gl.getAttribLocation(this.program, 'aPosition');
    this.gl.enableVertexAttribArray(positionLoc);
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  }

  // Linear interpolation between two values
  private lerpValue(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  // Get points interpolated along the stroke for smoother rendering
  private getInterpolatedPoints(start: Point, end: Point): Point[] {
    const points: Point[] = [];
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    
    // Adapt number of interpolation steps based on distance
    const steps = Math.min(
      Math.max(Math.ceil(distance / 5), 2),  // At least 2 points, more for longer strokes
      this.maxPoints                          // But not too many
    );
    
    // Create interpolated points
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      points.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t
      });
    }
    
    return points;
  }
}
