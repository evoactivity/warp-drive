<script setup lang="ts">
import { useWebGLComponent } from "./webgl-component";

interface Props {
  speed?: number;
  maxFps?: number;
  respectReducedMotion?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 1.0,
  maxFps: 60,
  respectReducedMotion: true,
});

const vertexShaderSource = /* glsl */ `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`;

const fragmentShaderSource = /* glsl */ `
  precision lowp float;

  // Ether by nimitz 2014 (twitter: @stormoid)
  // https://www.shadertoy.com/view/MsjSW3
  // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
  // Contact the author for other licensing options
  // Modified by Liam Potter 2024

  uniform vec2 u_resolution;
  uniform float u_time;

  mat2 m(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
  }

  float map(vec3 p) {
      float t = mod(u_time*0.5, 62.8326);
      p.xz *= m(t * 0.4);
      p.xy *= m(t * 0.3);
      vec3 q = p * 1.5 + t;
      return length(p + vec3(cos(t * 0.7))) * log(length(p) + 1.1) + cos(q.x + cos(q.z + cos(q.y))) * 0.5 - 1.;
  }

  void main() {
      // Fix coordinate system - use xy instead of yx for proper centering
      // Reduce the multiplier from 2.0 to 0.6 to make the bubble larger
      vec2 p = (gl_FragCoord.xy / u_resolution.xy - 0.5) * 0.6;

      // Calculate aspect ratio for responsive positioning
      float aspectRatio = u_resolution.x / u_resolution.y;

      // Apply aspect ratio correction to maintain circular shapes
      p.x *= aspectRatio;

      // Responsive positioning: pull right but keep visible at all widths
      // On wide screens: more offset, on narrow screens: less offset
      float maxOffset = min(aspectRatio * 0.2, 0.4); // Cap the offset to prevent off-screen
      p.x -= maxOffset;

      // Rotate the bubble
      p = m(4.) * p;

      vec3 cl = vec3(0.);
      float d = 2.5;
      for (int i = 0; i <= 7; i++) {
          vec3 pos = vec3(0, 0, 5.) + normalize(vec3(p, -1.)) * d;
          float rz = map(pos);
          float f = clamp((rz - map(pos + 0.1)) * 0.5, -0.1, 1.);
          vec3 l = vec3(0.1, 0.3, 0.4) + vec3(5., 2.5, 3.) * f;
          cl = cl * l + smoothstep(2.5, 0., rz) * 0.7 * l;
          d += min(rz, 1.);
      }
      gl_FragColor = vec4(cl, 1.);
  }
`;

const initialUniforms = {
  u_time: 0,
};

const updateUniforms = (uniforms: Record<string, any>, time: number, currentProps: Props) => {
  uniforms.u_time = time * (currentProps.speed || 1.0);
};

const { canvas, isLoading, hasError, errorMessage, shouldAnimate } = useWebGLComponent(
  props,
  "Bubble",
  vertexShaderSource,
  fragmentShaderSource,
  initialUniforms,
  updateUniforms
);
</script>

<template>
  <div v-if="hasError" class="error-state" role="alert">
    <div class="error-fallback">
      <h3>Bubble Effect Unavailable</h3>
      <p>{{ errorMessage }}</p>
      <p class="error-suggestion">Your device may not support WebGL.</p>
    </div>
  </div>
  <canvas
    v-else
    ref="canvas"
    class="bubble-canvas"
    role="img"
    :aria-label="shouldAnimate ? 'Animated bubble background' : 'Static bubble background'"
  />
</template>

<style scoped>
.bubble-canvas {
  display: block;
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  min-height: 900px;
  mix-blend-mode: screen;
}

.error-state {
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-align: center;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
}

.error-fallback h3 {
  color: #4a9eff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error-fallback p {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.error-suggestion {
  font-size: 0.9rem;
  color: #cccccc;
  font-style: italic;
}
</style>
