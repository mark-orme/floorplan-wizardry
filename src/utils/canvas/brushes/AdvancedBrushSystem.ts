
/**
 * Advanced brush system for Procreate-like drawing experience
 * Uses WebGL for high-performance rendering
 */
export class AdvancedBrushSystem {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private shaderProgram: WebGLProgram | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private textureCoordBuffer: WebGLBuffer | null = null;
  private brushTexture: WebGLTexture | null = null;
  private brushParams = {
    pressure: 1.0,
    tiltX: 0,
    tiltY: 0,
    velocity: 0,
    width: 5,
    color: '#000000'
  };

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this.gl = gl;
    this.initialize();
  }

  /**
   * Initialize WebGL resources
   */
  private initialize(): void {
    // Create shader program
    this.shaderProgram = this.createShaderProgram();
    
    // Create buffers
    this.createBuffers();
    
    // Create brush texture
    this.createBrushTexture();
  }

  /**
   * Create WebGL shader program for brush rendering
   */
  private createShaderProgram(): WebGLProgram | null {
    const gl = this.gl;
    
    // Vertex shader source
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform float uSize;
      uniform float uPressure;
      uniform vec2 uTilt;
      
      varying highp vec2 vTextureCoord;
      varying highp float vPressure;
      
      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        gl_PointSize = uSize * (0.5 + uPressure * 0.5);
        vTextureCoord = aTextureCoord;
        vPressure = uPressure;
      }
    `;
    
    // Fragment shader source
    const fsSource = `
      varying highp vec2 vTextureCoord;
      varying highp float vPressure;
      
      uniform sampler2D uSampler;
      uniform highp vec4 uBrushColor;
      
      void main(void) {
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        gl_FragColor = vec4(uBrushColor.rgb, texelColor.a * uBrushColor.a * vPressure);
      }
    `;
    
    // Create shaders
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fsSource);
    
    if (!vertexShader || !fragmentShader) {
      return null;
    }
    
    // Create program
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      console.error('Failed to create shader program');
      return null;
    }
    
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    
    return shaderProgram;
  }

  /**
   * Compile a shader of the given type with the provided source
   */
  private compileShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl;
    const shader = gl.createShader(type);
    
    if (!shader) {
      console.error('Failed to create shader');
      return null;
    }
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  /**
   * Create vertex and texture coordinate buffers
   */
  private createBuffers(): void {
    const gl = this.gl;
    
    // Create vertex buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Four vertices for a quad
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Create texture coordinate buffer
    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    
    const textureCoordinates = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  }

  /**
   * Create a brush texture
   */
  private createBrushTexture(): void {
    const gl = this.gl;
    
    // Create a texture
    this.brushTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.brushTexture);
    
    // Create a 64x64 texture with a soft circular brush
    const size = 64;
    const data = new Uint8Array(size * size * 4);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        
        // Calculate distance from center
        const dx = x - size / 2;
        const dy = y - size / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Smooth falloff for brush edge
        const radius = size / 2;
        let alpha = Math.max(0, 1 - distance / radius);
        alpha = Math.pow(alpha, 2); // Squared for smoother falloff
        
        data[index] = 255;     // R
        data[index + 1] = 255; // G
        data[index + 2] = 255; // B
        data[index + 3] = Math.floor(alpha * 255); // A
      }
    }
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  /**
   * Update brush parameters
   */
  public updateParameters(params: Partial<typeof this.brushParams>): void {
    this.brushParams = { ...this.brushParams, ...params };
  }

  /**
   * Draw a stroke segment between two points
   */
  public drawStroke(currentPoint: { x: number, y: number }, lastPoint: { x: number, y: number } | null): void {
    // If this is the first point in the stroke, just return as we need
    // two points to draw a segment
    if (!lastPoint) return;

    const gl = this.gl;
    
    if (!this.shaderProgram) {
      console.error('Shader program not initialized');
      return;
    }
    
    // Use shader program
    gl.useProgram(this.shaderProgram);
    
    // Get uniform locations
    const projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
    const modelViewMatrix = gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');
    const uSize = gl.getUniformLocation(this.shaderProgram, 'uSize');
    const uPressure = gl.getUniformLocation(this.shaderProgram, 'uPressure');
    const uTilt = gl.getUniformLocation(this.shaderProgram, 'uTilt');
    const uBrushColor = gl.getUniformLocation(this.shaderProgram, 'uBrushColor');
    
    // Set uniforms
    // For simplicity, using identity matrices here
    gl.uniformMatrix4fv(projectionMatrix, false, new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]));
    
    gl.uniformMatrix4fv(modelViewMatrix, false, new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]));
    
    gl.uniform1f(uSize, this.brushParams.width);
    gl.uniform1f(uPressure, this.brushParams.pressure);
    gl.uniform2f(uTilt, this.brushParams.tiltX, this.brushParams.tiltY);
    
    // Parse color
    const color = this.hexToRgb(this.brushParams.color);
    gl.uniform4f(uBrushColor, color.r / 255, color.g / 255, color.b / 255, 1.0);
    
    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.brushTexture);
    gl.uniform1i(gl.getUniformLocation(this.shaderProgram, 'uSampler'), 0);
    
    // For now, a simple implementation that draws interpolated points
    // In a full implementation, this would use custom geometry to create
    // a stroke with varying thickness based on pressure, tilt, etc.
    const steps = Math.max(1, Math.ceil(Math.hypot(
      currentPoint.x - lastPoint.x, 
      currentPoint.y - lastPoint.y
    ) / 2));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = lastPoint.x + (currentPoint.x - lastPoint.x) * t;
      const y = lastPoint.y + (currentPoint.y - lastPoint.y) * t;
      
      // Draw a point at this position
      // This would be enhanced in a full implementation
      this.drawPoint(x, y);
    }
  }

  /**
   * Draw a single point at the specified position
   */
  private drawPoint(x: number, y: number): void {
    // In a full implementation, this would use the vertex and texture buffers
    // to draw a textured quad at the specified position
    
    // Note: This is a simplified implementation
    console.log(`Drawing point at (${x}, ${y}) with pressure ${this.brushParams.pressure}`);
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number, g: number, b: number } {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }
}
