
/**
 * WebGL Renderer
 * A high-performance renderer for drawing operations using WebGL
 */
import { Point } from '@/types/core/Geometry';
import { optimizeDrawCalls } from '../canvas/renderOptimizer';

export class WebGLRenderer {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private initialized: boolean = false;
  private vertexBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;
  private positionLocation: number = -1;
  private resolutionLocation: WebGLUniformLocation | null = null;
  private colorLocation: WebGLUniformLocation | null = null;
  private thicknessLocation: WebGLUniformLocation | null = null;
  
  // Performance tracking
  private lastRenderTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  
  /**
   * Initialize WebGL renderer
   * @param canvas Canvas element to render to
   * @returns Whether initialization was successful
   */
  initialize(canvas: HTMLCanvasElement): boolean {
    try {
      // Try to get WebGL2 context first, then fall back to WebGL
      const gl = canvas.getContext('webgl2', { 
        antialias: true,
        premultipliedAlpha: false,
        alpha: true,
        preserveDrawingBuffer: true
      }) as WebGLRenderingContext;
      
      if (!gl) {
        // Try WebGL 1 as fallback
        const gl1 = canvas.getContext('webgl', {
          antialias: true,
          premultipliedAlpha: false,
          alpha: true,
          preserveDrawingBuffer: true
        }) as WebGLRenderingContext;
        
        if (!gl1) {
          console.error('WebGL not supported');
          return false;
        }
        
        this.gl = gl1;
      } else {
        this.gl = gl;
      }
      
      // Optimize WebGL settings
      optimizeDrawCalls(canvas, this.gl);
      
      // Initialize shaders
      this.initializeShaders();
      
      // Create buffers
      this.createBuffers();
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize WebGL:', error);
      return false;
    }
  }
  
  /**
   * Check if WebGL is initialized
   * @returns Whether WebGL is initialized
   */
  isInitialized(): boolean {
    return this.initialized && this.gl !== null;
  }
  
  /**
   * Initialize WebGL shaders
   */
  private initializeShaders(): void {
    if (!this.gl) return;
    
    // Vertex shader for drawing lines
    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
      uniform float u_thickness;
      
      void main() {
        // Convert position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;
        
        // Convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
        
        // Convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;
        
        // Flip Y coordinate
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = u_thickness;
      }
    `;
    
    // Fragment shader for drawing lines
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;
      
      void main() {
        gl_FragColor = u_color;
      }
    `;
    
    // Create and compile vertex shader
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    if (!vertexShader) return;
    
    // Create and compile fragment shader
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!fragmentShader) return;
    
    // Create shader program
    const program = this.gl.createProgram();
    if (!program) {
      console.error('Failed to create WebGL program');
      return;
    }
    
    // Attach shaders to program
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    
    // Link program
    this.gl.linkProgram(program);
    
    // Check if program linked successfully
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Failed to link WebGL program:', this.gl.getProgramInfoLog(program));
      return;
    }
    
    // Use program
    this.gl.useProgram(program);
    this.program = program;
    
    // Get attribute and uniform locations
    this.positionLocation = this.gl.getAttribLocation(program, 'a_position');
    this.resolutionLocation = this.gl.getUniformLocation(program, 'u_resolution');
    this.colorLocation = this.gl.getUniformLocation(program, 'u_color');
    this.thicknessLocation = this.gl.getUniformLocation(program, 'u_thickness');
  }
  
  /**
   * Create and compile a shader
   * @param type Shader type (vertex or fragment)
   * @param source Shader source code
   * @returns Compiled shader or null if compilation failed
   */
  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    
    // Create shader
    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error('Failed to create WebGL shader');
      return null;
    }
    
    // Set shader source
    this.gl.shaderSource(shader, source);
    
    // Compile shader
    this.gl.compileShader(shader);
    
    // Check if compilation succeeded
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Failed to compile WebGL shader:', this.gl.getShaderInfoLog(shader));
      return null;
    }
    
    return shader;
  }
  
  /**
   * Create WebGL buffers
   */
  private createBuffers(): void {
    if (!this.gl) return;
    
    // Create vertex buffer
    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) {
      console.error('Failed to create vertex buffer');
      return;
    }
    this.vertexBuffer = vertexBuffer;
    
    // Create index buffer for line strips
    const indexBuffer = this.gl.createBuffer();
    if (!indexBuffer) {
      console.error('Failed to create index buffer');
      return;
    }
    this.indexBuffer = indexBuffer;
  }
  
  /**
   * Draw a line strip
   * @param points Array of points to draw
   * @param color Line color (rgba values from 0-1)
   * @param thickness Line thickness in pixels
   * @param mode Drawing mode (0: points, 1: line strip)
   */
  drawLineStrip(
    points: Point[],
    color: [number, number, number, number] = [0, 0, 0, 1],
    thickness: number = 2,
    mode: 0 | 1 = 1
  ): void {
    if (!this.gl || !this.program || points.length < 2) return;
    
    const startTime = performance.now();
    
    // Use the shader program
    this.gl.useProgram(this.program);
    
    // Set resolution uniform
    if (this.resolutionLocation) {
      this.gl.uniform2f(
        this.resolutionLocation, 
        this.gl.canvas.width, 
        this.gl.canvas.height
      );
    }
    
    // Set color uniform
    if (this.colorLocation) {
      this.gl.uniform4fv(this.colorLocation, color);
    }
    
    // Set thickness uniform
    if (this.thicknessLocation) {
      this.gl.uniform1f(this.thicknessLocation, thickness);
    }
    
    // Prepare vertex data (x, y pairs)
    const vertices = new Float32Array(points.length * 2);
    for (let i = 0; i < points.length; i++) {
      vertices[i * 2] = points[i].x;
      vertices[i * 2 + 1] = points[i].y;
    }
    
    // Bind vertex buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Upload vertex data
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    
    // Enable position attribute
    this.gl.enableVertexAttribArray(this.positionLocation);
    
    // Set position attribute pointer
    this.gl.vertexAttribPointer(
      this.positionLocation,
      2,          // 2 components per vertex (x, y)
      this.gl.FLOAT, // Data type
      false,      // Don't normalize
      0,          // Stride (0 = auto)
      0           // Offset
    );
    
    // Draw based on mode
    if (mode === 0) {
      // Draw points
      this.gl.drawArrays(this.gl.POINTS, 0, points.length);
    } else {
      // Draw line strip
      this.gl.drawArrays(this.gl.LINE_STRIP, 0, points.length);
    }
    
    // Track render time and update FPS
    const endTime = performance.now();
    this.updatePerformanceMetrics(endTime - startTime);
  }
  
  /**
   * Draw a filled polygon
   * @param points Array of points forming the polygon
   * @param color Fill color (rgba values from 0-1)
   */
  drawFilledPolygon(
    points: Point[],
    color: [number, number, number, number] = [0, 0, 0, 1]
  ): void {
    if (!this.gl || !this.program || points.length < 3) return;
    
    const startTime = performance.now();
    
    // Use the shader program
    this.gl.useProgram(this.program);
    
    // Set resolution uniform
    if (this.resolutionLocation) {
      this.gl.uniform2f(
        this.resolutionLocation, 
        this.gl.canvas.width, 
        this.gl.canvas.height
      );
    }
    
    // Set color uniform
    if (this.colorLocation) {
      this.gl.uniform4fv(this.colorLocation, color);
    }
    
    // Prepare vertex data (x, y pairs)
    const vertices = new Float32Array(points.length * 2);
    for (let i = 0; i < points.length; i++) {
      vertices[i * 2] = points[i].x;
      vertices[i * 2 + 1] = points[i].y;
    }
    
    // Bind vertex buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Upload vertex data
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    
    // Enable position attribute
    this.gl.enableVertexAttribArray(this.positionLocation);
    
    // Set position attribute pointer
    this.gl.vertexAttribPointer(
      this.positionLocation,
      2,          // 2 components per vertex (x, y)
      this.gl.FLOAT, // Data type
      false,      // Don't normalize
      0,          // Stride (0 = auto)
      0           // Offset
    );
    
    // Create triangle indices from polygon
    const indices = this.triangulatePolygon(points.length);
    
    // Bind index buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
    // Upload index data
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );
    
    // Draw triangles
    this.gl.drawElements(
      this.gl.TRIANGLES,
      indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    );
    
    // Track render time and update FPS
    const endTime = performance.now();
    this.updatePerformanceMetrics(endTime - startTime);
  }
  
  /**
   * Create triangle indices for a simple polygon
   * @param vertexCount Number of vertices in the polygon
   * @returns Array of indices forming triangles
   */
  private triangulatePolygon(vertexCount: number): number[] {
    // Simple fan triangulation - only works for convex polygons
    const indices: number[] = [];
    
    // We need at least 3 vertices to form a triangle
    if (vertexCount < 3) return indices;
    
    // Create a fan of triangles from the first vertex
    for (let i = 1; i < vertexCount - 1; i++) {
      indices.push(0, i, i + 1);
    }
    
    return indices;
  }
  
  /**
   * Clear the canvas
   * @param color Clear color (rgba values from 0-1)
   */
  clear(color: [number, number, number, number] = [0, 0, 0, 0]): void {
    if (!this.gl) return;
    
    // Set clear color
    this.gl.clearColor(color[0], color[1], color[2], color[3]);
    
    // Clear color buffer
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
  
  /**
   * Update performance metrics
   * @param renderTime Time taken to render this frame in milliseconds
   */
  private updatePerformanceMetrics(renderTime: number): void {
    this.frameCount++;
    
    // Update FPS every second
    const now = performance.now();
    if (now - this.lastRenderTime >= 1000) {
      this.fps = this.frameCount / ((now - this.lastRenderTime) / 1000);
      this.frameCount = 0;
      this.lastRenderTime = now;
      
      // Log performance if it's below target
      if (renderTime > 16) { // 16ms = ~60fps
        console.log(`WebGL render time: ${renderTime.toFixed(2)}ms, FPS: ${this.fps.toFixed(1)}`);
      }
    }
  }
  
  /**
   * Get current FPS
   * @returns Current frames per second
   */
  getFPS(): number {
    return this.fps;
  }
  
  /**
   * Resize the WebGL viewport
   * @param width New width
   * @param height New height
   */
  resize(width: number, height: number): void {
    if (!this.gl) return;
    
    // Update canvas size
    this.gl.canvas.width = width;
    this.gl.canvas.height = height;
    
    // Update viewport
    this.gl.viewport(0, 0, width, height);
  }
  
  /**
   * Clean up WebGL resources
   */
  dispose(): void {
    if (!this.gl) return;
    
    // Delete buffers
    if (this.vertexBuffer) {
      this.gl.deleteBuffer(this.vertexBuffer);
      this.vertexBuffer = null;
    }
    
    if (this.indexBuffer) {
      this.gl.deleteBuffer(this.indexBuffer);
      this.indexBuffer = null;
    }
    
    // Delete program and shaders
    if (this.program) {
      // Get attached shaders
      const shaders = this.gl.getAttachedShaders(this.program);
      
      // Delete attached shaders
      if (shaders) {
        for (const shader of shaders) {
          this.gl.deleteShader(shader);
        }
      }
      
      // Delete program
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    
    // Reset state
    this.initialized = false;
  }
}
