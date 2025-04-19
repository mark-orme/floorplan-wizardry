
/**
 * Advanced brush system for WebGL-accelerated drawing
 * @module utils/canvas/brushes/AdvancedBrushSystem
 */

export class AdvancedBrushSystem {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private brushTexture: WebGLTexture | null = null;
  private parameters = {
    pressure: 1.0,
    tiltX: 0,
    tiltY: 0,
    velocity: 0,
    width: 2,
    color: '#000000'
  };

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this.gl = gl;
    this.initializeShaders();
    this.createBrushTexture();
  }

  /**
   * Initialize WebGL shaders for brush rendering
   */
  private initializeShaders() {
    const gl = this.gl;

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      
      uniform mat3 u_matrix;
      uniform float u_size;
      uniform float u_pressure;
      
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4((u_matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);
        gl_PointSize = u_size * u_pressure;
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform sampler2D u_texture;
      uniform vec4 u_color;
      uniform float u_opacity;
      uniform float u_pressure;
      uniform float u_tiltFactor;
      
      varying vec2 v_texCoord;
      
      void main() {
        vec4 texColor = texture2D(u_texture, v_texCoord);
        gl_FragColor = u_color * texColor;
        gl_FragColor.a *= u_opacity * u_pressure * (1.0 - u_tiltFactor);
      }
    `;

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    // Set shader sources
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    // Compile shaders
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Check for compilation errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vertexShader));
      return;
    }

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fragmentShader));
      return;
    }

    // Create program
    this.program = gl.createProgram();
    
    if (!this.program) {
      console.error('Failed to create program');
      return;
    }

    // Attach shaders
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);

    // Link program
    gl.linkProgram(this.program);

    // Check for linking errors
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(this.program));
      return;
    }

    // Create vertex buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Enable blend mode
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  /**
   * Create brush texture
   */
  private createBrushTexture() {
    const gl = this.gl;
    
    // Create texture
    this.brushTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.brushTexture);
    
    // Create a circular brush texture
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        
        // Calculate distance from center
        const distX = x - size / 2;
        const distY = y - size / 2;
        const dist = Math.sqrt(distX * distX + distY * distY);
        
        // Create a soft circular brush
        const alpha = Math.max(0, 1 - dist / (size / 2));
        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = Math.floor(alpha * alpha * 255);
      }
    }
    
    // Upload texture data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  /**
   * Update brush parameters
   */
  public updateParameters(params: Partial<typeof this.parameters>) {
    Object.assign(this.parameters, params);
  }

  /**
   * Draw a stroke between two points
   */
  public drawStroke(currentPoint: { x: number; y: number }, previousPoint: { x: number; y: number } | null) {
    if (!this.program) return;
    
    const gl = this.gl;
    
    // Use program
    gl.useProgram(this.program);
    
    // Set uniforms
    const colorLoc = gl.getUniformLocation(this.program, 'u_color');
    const sizeLoc = gl.getUniformLocation(this.program, 'u_size');
    const pressureLoc = gl.getUniformLocation(this.program, 'u_pressure');
    const opacityLoc = gl.getUniformLocation(this.program, 'u_opacity');
    const tiltFactorLoc = gl.getUniformLocation(this.program, 'u_tiltFactor');
    
    // Parse color
    const color = this.hexToRgb(this.parameters.color);
    gl.uniform4f(colorLoc, color.r / 255, color.g / 255, color.b / 255, 1.0);
    
    // Set size based on brush width
    gl.uniform1f(sizeLoc, this.parameters.width);
    
    // Set pressure
    gl.uniform1f(pressureLoc, this.parameters.pressure);
    
    // Set opacity
    gl.uniform1f(opacityLoc, 0.8);
    
    // Calculate tilt factor from tiltX and tiltY
    const tiltFactor = Math.min(1.0, Math.sqrt(
      this.parameters.tiltX * this.parameters.tiltX + 
      this.parameters.tiltY * this.parameters.tiltY
    ) / 90);
    gl.uniform1f(tiltFactorLoc, tiltFactor);
    
    // If we have both points, interpolate between them
    if (previousPoint) {
      this.drawLineSegment(currentPoint, previousPoint);
    } else {
      // Just draw a single point
      this.drawPoint(currentPoint);
    }
  }

  /**
   * Draw a single point
   */
  private drawPoint(point: { x: number; y: number }) {
    if (!this.program) return;
    
    const gl = this.gl;
    
    // Bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Set vertices
    const vertices = [point.x, point.y];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Set attributes
    const posLoc = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    
    // Draw points
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  /**
   * Draw a line segment between two points
   */
  private drawLineSegment(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    if (!this.program) return;
    
    const gl = this.gl;
    
    // Bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Set vertices
    const vertices = [p1.x, p1.y, p2.x, p2.y];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Set attributes
    const posLoc = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    
    // Draw line
    gl.drawArrays(gl.LINES, 0, 2);
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex
    const bigint = parseInt(hex, 16);
    
    // Extract RGB values
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }
}
