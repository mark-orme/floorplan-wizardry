
/**
 * WebGL helper utilities to accelerate canvas rendering
 */

// Feature detection
const hasWebGL2 = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!window.WebGL2RenderingContext && !!canvas.getContext('webgl2');
  } catch (e) {
    return false;
  }
};

const hasWebGL1 = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!window.WebGLRenderingContext && 
      !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
};

// WebGL capability check results
export const WebGLCapabilities = {
  hasWebGL2: hasWebGL2(),
  hasWebGL1: hasWebGL1(),
  hasAnyWebGL: hasWebGL2() || hasWebGL1()
};

// Store currently accelerated canvases
const acceleratedCanvases = new WeakMap<HTMLCanvasElement, {
  ctx: WebGLRenderingContext | WebGL2RenderingContext;
  program: WebGLProgram;
}>();

/**
 * Create a WebGL context for a canvas
 * @param canvas HTML Canvas element
 * @returns WebGL context or null if not supported
 */
export function createWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | WebGL2RenderingContext | null {
  // Try WebGL2 first
  if (WebGLCapabilities.hasWebGL2) {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    if (gl) return gl;
  }
  
  // Fall back to WebGL1
  if (WebGLCapabilities.hasWebGL1) {
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    }) || canvas.getContext('experimental-webgl');
    
    return gl as WebGLRenderingContext;
  }
  
  return null;
}

/**
 * Set up WebGL acceleration for a canvas
 * @param canvas HTML Canvas element
 * @returns Success status
 */
export function setupWebGLAcceleration(canvas: HTMLCanvasElement): boolean {
  if (acceleratedCanvases.has(canvas)) {
    return true; // Already accelerated
  }
  
  const gl = createWebGLContext(canvas);
  if (!gl) {
    console.warn('WebGL not supported, falling back to 2D context');
    return false;
  }
  
  try {
    // Set up basic WebGL program for 2D rendering
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to create shaders');
    }
    
    // Simple passthrough vertex shader
    gl.shaderSource(vertexShader, `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_position * 0.5 + 0.5;
      }
    `);
    
    // Simple fragment shader
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture;
      
      void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
      }
    `);
    
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    // Create and link program
    const program = gl.createProgram();
    if (!program) {
      throw new Error('Failed to create WebGL program');
    }
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    // Check for errors
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error(`WebGL program failed to link: ${info}`);
    }
    
    // Store acceleration info
    acceleratedCanvases.set(canvas, { ctx: gl, program });
    
    console.log('WebGL acceleration initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to set up WebGL acceleration:', error);
    return false;
  }
}

/**
 * Clean up WebGL resources for a canvas
 * @param canvas HTML Canvas element
 */
export function cleanupWebGLAcceleration(canvas: HTMLCanvasElement): void {
  const accel = acceleratedCanvases.get(canvas);
  if (!accel) return;
  
  const { ctx, program } = accel;
  
  // Delete program and attached shaders
  const shaders = ctx.getAttachedShaders(program);
  if (shaders) {
    shaders.forEach(shader => {
      ctx.detachShader(program, shader);
      ctx.deleteShader(shader);
    });
  }
  
  ctx.deleteProgram(program);
  acceleratedCanvases.delete(canvas);
}

/**
 * Check if a canvas is WebGL accelerated
 * @param canvas HTML Canvas element
 * @returns Whether canvas is using WebGL acceleration
 */
export function isWebGLAccelerated(canvas: HTMLCanvasElement): boolean {
  return acceleratedCanvases.has(canvas);
}
