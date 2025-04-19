
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseWebGLContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
}

export const useWebGLContext = ({ 
  canvasRef, 
  fabricCanvas 
}: UseWebGLContextProps) => {
  const glContextRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const initializationAttempted = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fabricCanvas || initializationAttempted.current) return;

    initializationAttempted.current = true;
    try {
      // Try to get WebGL2 context first, then fallback to WebGL
      const gl = (canvas.getContext('webgl2', { 
        alpha: true, 
        antialias: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        stencil: true 
      }) || 
      canvas.getContext('webgl', { 
        alpha: true, 
        antialias: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        stencil: true 
      })) as WebGLRenderingContext;

      if (!gl) {
        throw new Error('WebGL not supported');
      }

      glContextRef.current = gl;

      // Initialize WebGL configuration
      gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Set clear color (transparent)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      // Create shaders for custom brushes
      createShaderProgram(gl);
      
      console.log('WebGL context initialized successfully');
      
      // Create a buffer for vertices
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1
      ]), gl.STATIC_DRAW);
      
      const uniforms = {
        pressure: 0.5,
        tiltX: 0.0,
        tiltY: 0.0,
        brushColor: [0.0, 0.0, 0.0, 1.0]
      };
      
      // Override fabric's render method for specific objects if needed
      if (shaderProgramRef.current) {
        // Store original mouse:down event handler
        const originalMouseDownHandler = fabricCanvas.__eventListeners && 
          fabricCanvas.__eventListeners['mouse:down'] ? 
          [...fabricCanvas.__eventListeners['mouse:down']] : [];
        
        // Add custom handler that uses WebGL for rendering brush strokes
        fabricCanvas.on('mouse:down', function(opt) {
          // Execute original handlers
          originalMouseDownHandler.forEach(handler => handler(opt));
          
          if (fabricCanvas.isDrawingMode && glContextRef.current && shaderProgramRef.current) {
            // Add WebGL-accelerated brushstrokes
          }
        });
      }
    } catch (error) {
      console.error('Failed to initialize WebGL context:', error);
    }

    return () => {
      if (glContextRef.current) {
        // Clean up WebGL resources
        if (shaderProgramRef.current) {
          glContextRef.current.deleteProgram(shaderProgramRef.current);
          shaderProgramRef.current = null;
        }
        
        // Use WEBGL_lose_context extension to properly release context
        const ext = glContextRef.current.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        
        glContextRef.current = null;
        initializationAttempted.current = false;
      }
    };
  }, [canvasRef, fabricCanvas]);

  // Create shader program for custom brush effects
  const createShaderProgram = (gl: WebGLRenderingContext | WebGL2RenderingContext) => {
    // Vertex shader source
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      varying vec2 vTextureCoord;
      
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;

    // Fragment shader source for brush with pressure sensitivity
    const fsSource = `
      precision mediump float;
      
      varying vec2 vTextureCoord;
      
      uniform sampler2D uSampler;
      uniform vec4 uBrushColor;
      uniform float uPressure;
      uniform vec2 uTilt;
      
      void main() {
        // Calculate distance from center
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vTextureCoord, center);
        
        // Apply pressure and tilt to brush shape
        float alpha = smoothstep(0.5, 0.0, dist) * uPressure;
        
        // Apply tilt effect (shift the brush shape based on tilt)
        vec2 tiltOffset = uTilt * 0.1 * dist;
        vec2 adjustedCoord = vTextureCoord - tiltOffset;
        
        // Final brush color with alpha
        gl_FragColor = uBrushColor;
        gl_FragColor.a *= alpha;
      }
    `;

    // Create shader program
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Check if program was linked successfully
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Failed to link shader program:', gl.getProgramInfoLog(shaderProgram));
      return;
    }

    shaderProgramRef.current = shaderProgram;
    
    // Clean up individual shaders as they're no longer needed
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  };

  // Helper function to compile a shader
  const compileShader = (
    gl: WebGLRenderingContext | WebGL2RenderingContext, 
    type: number, 
    source: string
  ): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Failed to compile shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  return {
    glContext: glContextRef.current,
    shaderProgram: shaderProgramRef.current
  };
};
