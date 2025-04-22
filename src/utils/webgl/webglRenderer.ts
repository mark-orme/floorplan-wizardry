
/**
 * WebGL renderer for optimized canvas rendering
 */
import { Point } from '@/types/core/Geometry';

export class WebGLRenderer {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  
  constructor(canvas: HTMLCanvasElement) {
    // Try to get WebGL context with optimized settings
    const contextOptions = {
      alpha: true,
      antialias: true,
      depth: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
      desynchronized: true
    };
    
    this.gl = canvas.getContext('webgl', contextOptions) || 
              canvas.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext;
              
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }
    
    this.initShaders();
    this.initBuffers();
    
    // Configure WebGL
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.viewport(0, 0, canvas.width, canvas.height);
  }
  
  /**
   * Initialize WebGL shaders
   */
  private initShaders(): void {
    const gl = this.gl;
    if (!gl) return;
    
    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
      
      void main() {
        // Convert pixel space to clip space
        vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = 2.0;
      }
    `;
    
    // Fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;
      
      void main() {
        gl_FragColor = u_color;
      }
    `;
    
    // Create shaders
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to create shaders');
    }
    
    // Create program and link shaders
    this.program = gl.createProgram();
    if (!this.program) {
      throw new Error('Failed to create shader program');
    }
    
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    
    // Check if linking succeeded
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(this.program);
      throw new Error('Failed to link program: ' + info);
    }
    
    gl.useProgram(this.program);
  }
  
  /**
   * Create a shader from source
   * @param type Shader type
   * @param source Shader source code
   * @returns Shader object
   */
  private createShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl;
    if (!gl) return null;
    
    const shader = gl.createShader(type);
    if (!shader) {
      console.error('Failed to create shader');
      return null;
    }
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      console.error('Failed to compile shader:', info);
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  /**
   * Initialize WebGL buffers
   */
  private initBuffers(): void {
    const gl = this.gl;
    if (!gl || !this.program) return;
    
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Get attribute location
    const positionAttribLocation = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
  }
  
  /**
   * Draw a line between two points
   * @param start Start point
   * @param end End point
   * @param color Color as [r, g, b, a]
   * @param lineWidth Line width in pixels
   */
  drawLine(start: Point, end: Point, color: [number, number, number, number], lineWidth: number = 1): void {
    const gl = this.gl;
    if (!gl || !this.program) return;
    
    // Use program
    gl.useProgram(this.program);
    
    // Set resolution uniform
    const resolutionUniformLocation = gl.getUniformLocation(this.program, 'u_resolution');
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    
    // Set color uniform
    const colorUniformLocation = gl.getUniformLocation(this.program, 'u_color');
    gl.uniform4fv(colorUniformLocation, color);
    
    // Prepare vertices
    const vertices = new Float32Array([
      start.x, start.y,
      end.x, end.y
    ]);
    
    // Upload vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Set line width
    gl.lineWidth(lineWidth);
    
    // Draw line
    gl.drawArrays(gl.LINES, 0, 2);
  }
  
  /**
   * Draw a polyline (series of connected lines)
   * @param points Array of points
   * @param color Color as [r, g, b, a]
   * @param lineWidth Line width in pixels
   */
  drawPolyline(points: Point[], color: [number, number, number, number], lineWidth: number = 1): void {
    const gl = this.gl;
    if (!gl || !this.program || points.length < 2) return;
    
    // Use program
    gl.useProgram(this.program);
    
    // Set resolution uniform
    const resolutionUniformLocation = gl.getUniformLocation(this.program, 'u_resolution');
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    
    // Set color uniform
    const colorUniformLocation = gl.getUniformLocation(this.program, 'u_color');
    gl.uniform4fv(colorUniformLocation, color);
    
    // Prepare vertices
    const vertices = new Float32Array(points.length * 2);
    for (let i = 0; i < points.length; i++) {
      vertices[i * 2] = points[i].x;
      vertices[i * 2 + 1] = points[i].y;
    }
    
    // Upload vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Set line width
    gl.lineWidth(lineWidth);
    
    // Draw line strip
    gl.drawArrays(gl.LINE_STRIP, 0, points.length);
  }
  
  /**
   * Clear the canvas
   * @param color Clear color as [r, g, b, a]
   */
  clear(color: [number, number, number, number] = [0, 0, 0, 0]): void {
    const gl = this.gl;
    if (!gl) return;
    
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  
  /**
   * Dispose of WebGL resources
   */
  dispose(): void {
    const gl = this.gl;
    if (!gl) return;
    
    // Delete buffers
    if (this.vertexBuffer) {
      gl.deleteBuffer(this.vertexBuffer);
    }
    
    // Delete program and shaders
    if (this.program) {
      gl.deleteProgram(this.program);
    }
    
    // Lose context (cleanest way to release resources)
    const extension = gl.getExtension('WEBGL_lose_context');
    if (extension) {
      extension.loseContext();
    }
  }
}
