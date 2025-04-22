
/**
 * WebGL renderer for optimized canvas operations
 */
export class WebGLRenderer {
  private gl: WebGLRenderingContext | null = null;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private width: number;
  private height: number;
  private isWebGL2: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.initContext();
    this.initShaders();
  }

  private initContext(): void {
    // First try to get WebGL2 context, then fall back to WebGL1
    try {
      const ctx = this.canvas.getContext('webgl2');
      if (ctx) {
        this.gl = ctx;
        this.isWebGL2 = true;
        console.log('Using WebGL2 renderer');
        return;
      }
    } catch (e) {
      console.warn('WebGL2 not supported, falling back to WebGL1');
    }

    // Fall back to WebGL1
    try {
      const ctx = this.canvas.getContext('webgl') || 
                  this.canvas.getContext('experimental-webgl');
      if (ctx) {
        this.gl = ctx as WebGLRenderingContext;
        console.log('Using WebGL1 renderer');
        return;
      }
    } catch (e) {
      console.error('WebGL not supported', e);
    }

    console.error('Could not initialize WebGL context');
  }

  private initShaders(): void {
    if (!this.gl) return;

    // Create shader program
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
      void main() {
        // Convert from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;
        // Convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
        // Convert from 0->2 to -1->1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;
        // Flip Y axis
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }
    `);

    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    // Create the program
    const program = this.gl.createProgram();
    if (!program) {
      console.error('Failed to create shader program');
      return;
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!success) {
      console.error('Failed to link program:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return;
    }

    this.program = program;
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    
    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error('Failed to create shader');
      return null;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (!success) {
      console.error('Failed to compile shader:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Clear the canvas with a specific color
   */
  clear(r: number = 0, g: number = 0, b: number = 0, a: number = 0): void {
    if (!this.gl) return;
    
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * Draw a line between two points
   */
  drawLine(x1: number, y1: number, x2: number, y2: number, color: [number, number, number, number], thickness: number = 1): void {
    if (!this.gl || !this.program) return;

    this.gl.useProgram(this.program);

    // Set up position attribute
    const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    
    // Calculate line vertices 
    const vertices = this.calculateLineVertices(x1, y1, x2, y2, thickness);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    
    // Set up the position attribute
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    
    // Set up resolution uniform
    const resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");
    this.gl.uniform2f(resolutionUniformLocation, this.width, this.height);
    
    // Set up color uniform
    const colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color");
    this.gl.uniform4fv(colorUniformLocation, color);
    
    // Draw the line
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, vertices.length / 2);
  }

  /**
   * Calculate vertices for a line with thickness
   */
  private calculateLineVertices(x1: number, y1: number, x2: number, y2: number, thickness: number): number[] {
    // Calculate line direction
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize and scale by half thickness
    const halfThickness = thickness / 2;
    const nx = dy / len * halfThickness;
    const ny = -dx / len * halfThickness;
    
    // Return vertices for two triangles forming a quad
    return [
      x1 + nx, y1 + ny,
      x1 - nx, y1 - ny,
      x2 + nx, y2 + ny,
      x2 - nx, y2 - ny
    ];
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // Clean up buffers, shaders, etc.
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }

  /**
   * Return the WebGL context
   */
  getContext(): WebGLRenderingContext | null {
    return this.gl;
  }

  /**
   * Check if context is WebGL2
   */
  isWebGL2Context(): boolean {
    return this.isWebGL2;
  }
}
