
import { Point } from '@/types/core/Point';

interface BrushParameters {
  pressure: number;
  tiltX: number;
  tiltY: number;
  velocity: number;
  width: number;
  color: string;
}

/**
 * Advanced brush system using WebGL for high-performance, professional-quality brush rendering
 */
export class AdvancedBrushSystem {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private shaderProgram: WebGLProgram | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private textureBuffer: WebGLBuffer | null = null;
  private brushTexture: WebGLTexture | null = null;
  private parameters: BrushParameters = {
    pressure: 1.0,
    tiltX: 0,
    tiltY: 0,
    velocity: 0,
    width: 2,
    color: '#000000',
  };

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this.gl = gl;
    this.initShaders();
    this.initBuffers();
    this.initBrushTextures();
  }

  /**
   * Update brush parameters based on input
   */
  updateParameters(params: Partial<BrushParameters>): void {
    this.parameters = { ...this.parameters, ...params };
  }

  /**
   * Draw a stroke segment between two points
   */
  drawStroke(currentPoint: Point, lastPoint: Point | null): void {
    if (!this.shaderProgram || !lastPoint) return;

    const { pressure, tiltX, tiltY, velocity, width, color } = this.parameters;
    
    // Parse color to RGB
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    
    const gl = this.gl;
    
    // Use shader program
    gl.useProgram(this.shaderProgram);
    
    // Set uniforms for shader
    const colorLocation = gl.getUniformLocation(this.shaderProgram, 'u_color');
    gl.uniform4f(colorLocation, r, g, b, Math.min(pressure, 1.0));
    
    const widthLocation = gl.getUniformLocation(this.shaderProgram, 'u_width');
    const adjustedWidth = width * Math.max(0.5, pressure);
    gl.uniform1f(widthLocation, adjustedWidth);
    
    const tiltLocation = gl.getUniformLocation(this.shaderProgram, 'u_tilt');
    gl.uniform2f(tiltLocation, tiltX / 90, tiltY / 90);
    
    const velocityLocation = gl.getUniformLocation(this.shaderProgram, 'u_velocity');
    gl.uniform1f(velocityLocation, velocity);
    
    // Draw the stroke
    // In a real implementation, we would use a more sophisticated approach
    // For example, rendering a quad strip along the path or using triangles
    // For simplicity, we're just drawing a line between the points
    const vertices = [
      lastPoint.x, lastPoint.y,
      currentPoint.x, currentPoint.y
    ];
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(this.shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    gl.drawArrays(gl.LINES, 0, 2);
  }

  /**
   * Initialize WebGL shaders
   */
  private initShaders(): void {
    const gl = this.gl;
    
    // Vertex shader source
    const vsSource = `
      attribute vec2 a_position;
      uniform float u_width;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = u_width;
      }
    `;
    
    // Fragment shader source
    const fsSource = `
      precision mediump float;
      uniform vec4 u_color;
      uniform vec2 u_tilt;
      uniform float u_velocity;
      
      void main() {
        // Calculate distance from center for smooth point
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        // Adjust alpha based on distance for a smooth edge
        float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
        
        // Apply tilt effect by adjusting the shape slightly
        float tiltInfluence = max(abs(u_tilt.x), abs(u_tilt.y)) * 0.3;
        float tiltAngle = atan(u_tilt.y, u_tilt.x);
        vec2 tiltVector = vec2(cos(tiltAngle), sin(tiltAngle));
        float tiltEffect = dot(normalize(coord), tiltVector) * tiltInfluence;
        
        // Apply velocity effect (thinner at higher speeds)
        float velocityEffect = mix(1.0, 0.7, min(u_velocity, 1.0));
        
        // Combine effects
        alpha *= (1.0 + tiltEffect) * velocityEffect;
        
        gl_FragColor = vec4(u_color.rgb, u_color.a * alpha);
      }
    `;
    
    // Create and compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
      console.error('Failed to create vertex shader');
      return;
    }
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compile error:', gl.getShaderInfoLog(vertexShader));
      gl.deleteShader(vertexShader);
      return;
    }
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      console.error('Failed to create fragment shader');
      return;
    }
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compile error:', gl.getShaderInfoLog(fragmentShader));
      gl.deleteShader(fragmentShader);
      return;
    }
    
    // Create program and link shaders
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      console.error('Failed to create shader program');
      return;
    }
    
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader program link error:', gl.getProgramInfoLog(shaderProgram));
      return;
    }
    
    this.shaderProgram = shaderProgram;
  }

  /**
   * Initialize WebGL buffers
   */
  private initBuffers(): void {
    const gl = this.gl;
    
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Create initial buffer data
    const vertices = new Float32Array([0, 0, 0, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Create a buffer for texture coordinates if needed
    this.textureBuffer = gl.createBuffer();
  }

  /**
   * Initialize brush textures for different brush types
   */
  private initBrushTextures(): void {
    const gl = this.gl;
    
    // Create a brush texture
    this.brushTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.brushTexture);
    
    // Create a simple circular brush texture
    // In a real app, you would load different brush textures
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    
    const center = size / 2;
    const radius = size / 2 - 1;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        
        // Calculate distance from center
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create a circular shape with smooth edges
        let alpha;
        if (distance >= radius) {
          alpha = 0;
        } else if (distance >= radius - 2) {
          alpha = (radius - distance) / 2 * 255;
        } else {
          alpha = 255;
        }
        
        // Set RGBA values
        data[index] = 255; // R
        data[index + 1] = 255; // G
        data[index + 2] = 255; // B
        data[index + 3] = alpha; // A
      }
    }
    
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      size,
      size,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data
    );
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  }
}
