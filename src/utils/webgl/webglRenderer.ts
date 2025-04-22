
/**
 * WebGL Renderer
 * Provides optimized rendering using WebGL for canvas operations
 */

export class WebGLRenderer {
  private gl: WebGLRenderingContext | null = null;
  private canvas: HTMLCanvasElement;
  private programInfo: any = null;
  private buffers: any = null;
  private lastTimestamp: number = 0;
  private frameRate: number = 0;
  private isDestroyed: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initialize();
  }

  /**
   * Initialize WebGL context and resources
   */
  private initialize(): void {
    try {
      // Try to get WebGL context with optimized settings
      const contextOptions: WebGLContextAttributes = {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        desynchronized: true, // For lower latency
        powerPreference: 'high-performance'
      };

      // Try WebGL2 first, then fall back to WebGL1
      this.gl = this.canvas.getContext('webgl2', contextOptions) as WebGLRenderingContext || 
                this.canvas.getContext('webgl', contextOptions) as WebGLRenderingContext;

      if (!this.gl) {
        throw new Error('WebGL not supported');
      }

      // Basic WebGL setup
      this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      
      // Enable transparency
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      
      // Create shader programs
      this.initShaders();
      
      // Initialize buffers
      this.initBuffers();
      
      console.log('WebGL Renderer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebGL renderer:', error);
      this.gl = null;
    }
  }

  /**
   * Initialize WebGL shaders
   */
  private initShaders(): void {
    if (!this.gl) return;

    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      varying lowp vec4 vColor;
      
      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
      }
    `;

    // Fragment shader program
    const fsSource = `
      varying lowp vec4 vColor;
      
      void main(void) {
        gl_FragColor = vColor;
      }
    `;

    // Initialize a shader program
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = this.gl.createProgram();
    if (!shaderProgram || !vertexShader || !fragmentShader) {
      throw new Error('Failed to create shader program');
    }
    
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    // Check if creating the shader program succeeded
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
    }

    // Collect all the info needed to use the shader program
    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      },
    };
  }

  /**
   * Initialize buffers for rendering
   */
  private initBuffers(): void {
    if (!this.gl) return;

    // Create position buffer
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    // Initial empty positions
    const positions = [
      -1.0, 1.0,
      1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    // Create color buffer
    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);

    // Initial colors (RGBA)
    const colors = [
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

    this.buffers = {
      position: positionBuffer,
      color: colorBuffer,
    };
  }

  /**
   * Draw a line with WebGL
   * @param startX Start X position
   * @param startY Start Y position
   * @param endX End X position
   * @param endY End Y position
   * @param color Line color in rgba format
   * @param width Line width
   */
  public drawLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: [number, number, number, number] = [0, 0, 0, 1],
    width: number = 1
  ): void {
    if (!this.gl || !this.programInfo || !this.buffers) return;

    // Convert from pixel coordinates to clip space
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    const x1 = (startX / canvasWidth) * 2 - 1;
    const y1 = -((startY / canvasHeight) * 2 - 1);
    const x2 = (endX / canvasWidth) * 2 - 1;
    const y2 = -((endY / canvasHeight) * 2 - 1);

    // Update position buffer with line coordinates
    const positions = [
      x1, y1,
      x2, y2,
    ];
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);

    // Update color buffer
    const colors = [
      ...color,
      ...color,
    ];
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.DYNAMIC_DRAW);

    // Set shader program
    this.gl.useProgram(this.programInfo.program);

    // Set up attributes
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexPosition,
      2, // numComponents
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexColor,
      4, // numComponents
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);

    // Set uniform matrices
    // Identity matrices for now
    const projectionMatrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
    
    const modelViewMatrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];

    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );

    // Set line width
    this.gl.lineWidth(width);

    // Draw the line
    this.gl.drawArrays(this.gl.LINES, 0, 2);

    // Update frame rate
    const now = performance.now();
    if (this.lastTimestamp > 0) {
      const delta = now - this.lastTimestamp;
      this.frameRate = 1000 / delta;
    }
    this.lastTimestamp = now;
  }

  /**
   * Create a shader
   * @param type Shader type
   * @param source Shader source code
   * @returns Shader object
   */
  private loadShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    // Send the source to the shader object
    this.gl.shaderSource(shader, source);

    // Compile the shader program
    this.gl.compileShader(shader);

    // See if it compiled successfully
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(`An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`);
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Clear the WebGL canvas
   */
  public clear(): void {
    if (!this.gl) return;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * Get current frame rate
   * @returns Current frame rate
   */
  public getFrameRate(): number {
    return this.frameRate;
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (!this.gl || this.isDestroyed) return;
    
    // Clean up shader program
    if (this.programInfo && this.programInfo.program) {
      this.gl.deleteProgram(this.programInfo.program);
    }
    
    // Clean up buffers
    if (this.buffers) {
      if (this.buffers.position) this.gl.deleteBuffer(this.buffers.position);
      if (this.buffers.color) this.gl.deleteBuffer(this.buffers.color);
    }
    
    // Mark as destroyed
    this.isDestroyed = true;
    this.gl = null;
  }
}
