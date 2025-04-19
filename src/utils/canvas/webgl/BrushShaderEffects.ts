
export class BrushShaderEffects {
  // Improved vertex shader with support for more natural brush strokes
  private static readonly brushVertexShader = `
    attribute vec2 position;
    attribute vec2 texCoord;
    attribute float pressure;
    attribute float tilt;
    attribute float azimuth;
    
    uniform float pointSize;
    uniform vec2 resolution;
    
    varying vec2 vTexCoord;
    varying float vPressure;
    varying float vTilt;
    varying float vAzimuth;
    
    void main() {
      vec2 normalized = position / resolution * 2.0 - 1.0;
      gl_Position = vec4(normalized, 0, 1);
      gl_PointSize = pointSize * (pressure * 0.5 + 0.5); // Dynamic point size based on pressure
      
      vTexCoord = texCoord;
      vPressure = pressure;
      vTilt = tilt;
      vAzimuth = azimuth;
    }
  `;

  // Advanced fragment shader with multiple artistic media simulation
  private static readonly brushFragmentShader = `
    precision highp float;
    
    varying vec2 vTexCoord;
    varying float vPressure;
    varying float vTilt;
    varying float vAzimuth;
    
    uniform vec4 brushColor;
    uniform sampler2D brushTexture;
    uniform float brushHardness;
    uniform int brushType; // 0: pencil, 1: pen, 2: marker, 3: watercolor, 4: charcoal
    uniform float randomSeed;
    
    // Noise function for natural media simulation
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    // Perlin-like noise for texture
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 coord = gl_PointCoord * 2.0 - 1.0;
      float dist = length(coord);
      
      // Base alpha for brush shape
      float alpha = smoothstep(1.0, brushHardness, dist);
      
      // Apply pressure variation
      alpha *= vPressure;
      
      // Apply tilt for directional effects
      float tiltEffect = 1.0;
      if (vTilt > 0.01) {
        // Create an angle-based effect using tilt and azimuth
        float angle = atan(coord.y, coord.x) - vAzimuth;
        tiltEffect = mix(1.0, 0.2 + 0.8 * abs(cos(angle)), vTilt);
        alpha *= tiltEffect;
      }
      
      // Add media-specific effects based on brush type
      vec4 finalColor = brushColor;
      
      if (brushType == 0) { // Pencil
        // Grainy texture for pencil
        float noise1 = noise(coord * 15.0 + randomSeed);
        float noise2 = noise(coord * 30.0 - randomSeed);
        alpha *= 0.8 + 0.2 * mix(noise1, noise2, 0.5);
        alpha *= (1.0 - 0.3 * noise(coord * 5.0));
      }
      else if (brushType == 1) { // Pen
        // Smoother with ink flow simulation
        alpha *= 1.0 - 0.1 * noise(coord * 20.0 + randomSeed * 3.0);
        alpha = pow(alpha, 1.2); // Sharper edges
      }
      else if (brushType == 2) { // Marker
        // More uniform, slight texture
        alpha = pow(alpha, 0.8); // Softer edges
        // Marker color blending
        finalColor.rgb = mix(finalColor.rgb, finalColor.rgb * 0.8, noise(coord * 4.0) * 0.2);
      }
      else if (brushType == 3) { // Watercolor
        // Edge darkening and bleeding simulation
        float edge = smoothstep(0.8, 1.0, dist);
        alpha *= (1.0 - 0.3 * edge);
        float bleed = noise(coord * 8.0 + randomSeed) * noise(coord * 4.0 - randomSeed);
        alpha *= 0.85 + 0.15 * bleed;
        alpha = pow(alpha, 0.7); // Much softer edges
      }
      else if (brushType == 4) { // Charcoal
        // Very textured with rough edges
        float noise1 = noise(coord * 25.0 + randomSeed);
        float noise2 = noise(coord * 50.0 - randomSeed * 0.7);
        float noise3 = noise(coord * 10.0 + randomSeed * 3.0);
        alpha *= 0.7 + 0.3 * mix(noise1, noise2, noise3);
        alpha *= (1.0 - 0.5 * noise(coord * 7.0 + randomSeed));
      }
      
      gl_FragColor = finalColor * alpha;
    }
  `;

  // Shader program references
  private static program: WebGLProgram | null = null;
  private static uniforms: Record<string, WebGLUniformLocation | null> = {};
  private static attributes: Record<string, number> = {};
  private static textures: Record<string, WebGLTexture | null> = {};
  
  // Create brush textures for different media types
  private static createBrushTexture(gl: WebGL2RenderingContext, type: number): WebGLTexture | null {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Create texture data based on brush type
    const size = 64;
    const data = new Uint8Array(size * size * 4);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        
        // Normalize coordinates to -1 to 1
        const nx = (x / size) * 2 - 1;
        const ny = (y / size) * 2 - 1;
        const dist = Math.sqrt(nx * nx + ny * ny);
        
        let alpha = 0;
        
        switch(type) {
          case 0: // Pencil
            alpha = Math.max(0, 1 - dist * 1.1);
            alpha *= 0.8 + 0.2 * Math.random(); // Grainy
            break;
          case 1: // Pen
            alpha = Math.max(0, 1 - dist * 1.05);
            alpha = Math.pow(alpha, 1.2); // Sharper
            break;
          case 2: // Marker
            alpha = Math.max(0, 1 - dist);
            alpha = Math.pow(alpha, 0.7); // Softer
            break;
          case 3: // Watercolor
            alpha = Math.max(0, 1 - dist * 0.9);
            alpha *= 0.85 + 0.15 * Math.random(); // Bleedy
            alpha = Math.pow(alpha, 0.6); // Very soft
            break;
          case 4: // Charcoal
            alpha = Math.max(0, 1 - dist * 1.2);
            alpha *= 0.7 + 0.3 * Math.random(); // Very textured
            break;
        }
        
        data[i] = 255; // R
        data[i + 1] = 255; // G
        data[i + 2] = 255; // B
        data[i + 3] = Math.min(255, Math.max(0, alpha * 255)); // A
      }
    }
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    return texture;
  }

  static initShaders(gl: WebGL2RenderingContext): boolean {
    try {
      // Compile vertex shader
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      if (!vertexShader) return false;
      gl.shaderSource(vertexShader, this.brushVertexShader);
      gl.compileShader(vertexShader);
      
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Vertex shader compilation error:", gl.getShaderInfoLog(vertexShader));
        return false;
      }
      
      // Compile fragment shader
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      if (!fragmentShader) return false;
      gl.shaderSource(fragmentShader, this.brushFragmentShader);
      gl.compileShader(fragmentShader);
      
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Fragment shader compilation error:", gl.getShaderInfoLog(fragmentShader));
        return false;
      }
      
      // Create shader program
      this.program = gl.createProgram();
      if (!this.program) return false;
      
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);
      
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error("Shader program linking error:", gl.getProgramInfoLog(this.program));
        return false;
      }
      
      // Get attribute locations
      this.attributes.position = gl.getAttribLocation(this.program, "position");
      this.attributes.texCoord = gl.getAttribLocation(this.program, "texCoord");
      this.attributes.pressure = gl.getAttribLocation(this.program, "pressure");
      this.attributes.tilt = gl.getAttribLocation(this.program, "tilt");
      this.attributes.azimuth = gl.getAttribLocation(this.program, "azimuth");
      
      // Get uniform locations
      this.uniforms.pointSize = gl.getUniformLocation(this.program, "pointSize");
      this.uniforms.resolution = gl.getUniformLocation(this.program, "resolution");
      this.uniforms.brushColor = gl.getUniformLocation(this.program, "brushColor");
      this.uniforms.brushTexture = gl.getUniformLocation(this.program, "brushTexture");
      this.uniforms.brushHardness = gl.getUniformLocation(this.program, "brushHardness");
      this.uniforms.brushType = gl.getUniformLocation(this.program, "brushType");
      this.uniforms.randomSeed = gl.getUniformLocation(this.program, "randomSeed");
      
      // Create brush textures
      for (let i = 0; i < 5; i++) {
        this.textures[`brush${i}`] = this.createBrushTexture(gl, i);
      }
      
      console.log("WebGL shaders for brush effects initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing WebGL shaders:", error);
      return false;
    }
  }

  static updateBrushParameters(
    gl: WebGL2RenderingContext,
    params: {
      pressure: number,
      tilt: number,
      azimuth: number,
      width: number,
      color: string,
      brushType: number,
      hardness: number
    }
  ): boolean {
    try {
      if (!this.program) return false;
      
      gl.useProgram(this.program);
      
      // Set canvas resolution
      gl.uniform2f(this.uniforms.resolution, gl.canvas.width, gl.canvas.height);
      
      // Set point size based on brush width
      gl.uniform1f(this.uniforms.pointSize, params.width);
      
      // Parse color
      const r = parseInt(params.color.slice(1, 3), 16) / 255;
      const g = parseInt(params.color.slice(3, 5), 16) / 255;
      const b = parseInt(params.color.slice(5, 7), 16) / 255;
      gl.uniform4f(this.uniforms.brushColor, r, g, b, 1.0);
      
      // Set brush texture based on type
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textures[`brush${params.brushType}`]);
      gl.uniform1i(this.uniforms.brushTexture, 0);
      
      // Set brush hardness
      gl.uniform1f(this.uniforms.brushHardness, params.hardness);
      
      // Set brush type
      gl.uniform1i(this.uniforms.brushType, params.brushType);
      
      // Set random seed for texture variation
      gl.uniform1f(this.uniforms.randomSeed, Math.random());
      
      return true;
    } catch (error) {
      console.error("Error updating brush parameters:", error);
      return false;
    }
  }

  static drawStroke(
    gl: WebGL2RenderingContext,
    points: Array<{
      x: number,
      y: number,
      pressure: number,
      tiltX: number,
      tiltY: number
    }>
  ): boolean {
    try {
      if (!this.program || points.length === 0) return false;
      
      gl.useProgram(this.program);
      
      // Prepare vertex data
      const positions: number[] = [];
      const texCoords: number[] = [];
      const pressures: number[] = [];
      const tilts: number[] = [];
      const azimuths: number[] = [];
      
      points.forEach(point => {
        // Convert to normalized device coordinates
        positions.push(point.x, point.y);
        texCoords.push(0.5, 0.5); // Center of texture
        pressures.push(point.pressure);
        
        // Calculate tilt magnitude and azimuth angle
        const tiltMagnitude = Math.sqrt(point.tiltX * point.tiltX + point.tiltY * point.tiltY) / 90;
        const azimuth = Math.atan2(point.tiltY, point.tiltX);
        
        tilts.push(tiltMagnitude);
        azimuths.push(azimuth);
      });
      
      // Create and bind buffer for position attribute
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.attributes.position);
      gl.vertexAttribPointer(this.attributes.position, 2, gl.FLOAT, false, 0, 0);
      
      // Create and bind buffer for texCoord attribute
      const texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.attributes.texCoord);
      gl.vertexAttribPointer(this.attributes.texCoord, 2, gl.FLOAT, false, 0, 0);
      
      // Create and bind buffer for pressure attribute
      const pressureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pressureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pressures), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.attributes.pressure);
      gl.vertexAttribPointer(this.attributes.pressure, 1, gl.FLOAT, false, 0, 0);
      
      // Create and bind buffer for tilt attribute
      const tiltBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, tiltBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tilts), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.attributes.tilt);
      gl.vertexAttribPointer(this.attributes.tilt, 1, gl.FLOAT, false, 0, 0);
      
      // Create and bind buffer for azimuth attribute
      const azimuthBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, azimuthBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(azimuths), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.attributes.azimuth);
      gl.vertexAttribPointer(this.attributes.azimuth, 1, gl.FLOAT, false, 0, 0);
      
      // Draw points
      gl.drawArrays(gl.POINTS, 0, points.length);
      
      // Clean up
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
      gl.deleteBuffer(pressureBuffer);
      gl.deleteBuffer(tiltBuffer);
      gl.deleteBuffer(azimuthBuffer);
      
      return true;
    } catch (error) {
      console.error("Error drawing stroke:", error);
      return false;
    }
  }
}
