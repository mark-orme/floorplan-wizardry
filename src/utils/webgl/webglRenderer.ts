
import { Canvas as FabricCanvas } from 'fabric';

export class WebGLRenderer {
  private gl: WebGLRenderingContext | null = null;
  private canvas: HTMLCanvasElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initWebGL();
  }

  private initWebGL() {
    try {
      const contextOptions: WebGLContextAttributes = {
        alpha: true,
        depth: true,
        stencil: true,
        antialias: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false
      };

      this.gl = this.canvas?.getContext('webgl', contextOptions) || 
                this.canvas?.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext;

      if (!this.gl) {
        throw new Error('WebGL not supported');
      }

      // Configure WebGL context
      const gl = this.gl;
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    } catch (error) {
      console.error('Failed to initialize WebGL:', error);
      throw error;
    }
  }

  public dispose() {
    if (this.gl) {
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      this.gl = null;
    }
  }
}
