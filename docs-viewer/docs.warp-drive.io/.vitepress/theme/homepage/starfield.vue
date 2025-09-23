<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useWebGLComponent, hexToGLSLColor } from "./webgl-component";

interface Props {
  color?: string;
  speed?: number;
  trailLength?: number;
  maxFps?: number;
  respectReducedMotion?: boolean;
  enableScrollSpeed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "#6f1f6f",
  speed: 0.4,
  trailLength: 0.004,
  maxFps: 60,
  respectReducedMotion: true,
  enableScrollSpeed: false,
});

const scrollProgress = ref(0);
const baseSpeed = computed(() => props.speed);
const accumulatedTime = ref(0);
let lastUpdateTime = 0;

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const maxHeight = 1000;

  if (maxHeight <= 0) {
    scrollProgress.value = 0;
  } else {
    scrollProgress.value = Math.min(Math.max(scrollTop / maxHeight, 0), 1);
  }
};

onMounted(() => {
  if (props.enableScrollSpeed) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
});

onUnmounted(() => {
  if (props.enableScrollSpeed) {
    window.removeEventListener("scroll", handleScroll);
  }
});

const dynamicSpeed = computed(() => {
  if (!props.enableScrollSpeed) {
    return baseSpeed.value;
  }

  const speedMultiplier = 1 + scrollProgress.value * 20;
  return baseSpeed.value * speedMultiplier;
});

const glslColor = computed(() => hexToGLSLColor(props.color));

const vertexShaderSource = /*glsl*/ `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`;

const fragmentShaderSource = /*glsl*/ `
  precision lowp float;

  uniform vec2 u_resolution;
  uniform float u_accumulated_time;
  uniform float u_trail_length;
  uniform vec3 u_color;

  float Cell(vec2 c) {
    vec2 uv = fract(c);
    c -= uv;
    return (1. - length(uv * 4. - 1.)) * step(fract(sin(c.x + c.y * 1e2) * 1e3), .004);
  }

  void main() {
    float trailLength = u_trail_length;

    // Convert screen coordinates to normalized coordinates centered at origin
    vec2 p = gl_FragCoord.xy / u_resolution.xy - 0.5;

    // Convert to polar coordinates
    float a = fract(atan(p.x, p.y) / 6.2832);
    float d = length(p);

    // Time-based animation offset using accumulated time
    float z = u_accumulated_time / 10.0;
    float intensity = 0.0;

    // Layer multiple star fields for depth effect
    for (int i = 0; i < 10; i++) {
      z += 1.02;
      vec2 coord = vec2(pow(d, trailLength), a) * 356.0;
      vec2 delta = vec2(1.0 + z * 15.0, 1.0);
      float c = Cell(coord -= delta);
      c += Cell(coord -= delta);
      intensity += c * d * 3.0;
    }

    // Apply color and alpha based on intensity
    vec3 col = u_color * intensity;
    float alpha = intensity;
    gl_FragColor = vec4(col, alpha);
  }
`;

const initialUniforms = {
  u_accumulated_time: 0,
  u_trail_length: props.trailLength,
  u_color: glslColor.value,
};

const updateUniforms = (uniforms: Record<string, any>, time: number, currentProps: Props) => {
  if (lastUpdateTime === 0) {
    lastUpdateTime = time;
  }

  const deltaTime = time - lastUpdateTime;
  lastUpdateTime = time;

  accumulatedTime.value += deltaTime * dynamicSpeed.value;

  uniforms.u_accumulated_time = accumulatedTime.value;
  uniforms.u_trail_length = currentProps.trailLength;
  uniforms.u_color = hexToGLSLColor(currentProps.color || "#6f1f6f");
};

const { canvas, isLoading, hasError, errorMessage, shouldAnimate } = useWebGLComponent(
  props,
  "Starfield",
  vertexShaderSource,
  fragmentShaderSource,
  initialUniforms,
  updateUniforms
);
</script>

<template>
  <div v-if="hasError" class="error-state" role="alert">
    <div class="error-fallback">
      <h3>Starfield Unavailable</h3>
      <p>{{ errorMessage }}</p>
      <p class="error-suggestion">Your device may not support WebGL.</p>
    </div>
  </div>
  <canvas
    v-else
    ref="canvas"
    class="starfield-canvas"
    role="img"
    :aria-label="shouldAnimate ? 'Animated starfield background' : 'Static starfield background'"
  />
</template>

<style scoped>
.starfield-canvas {
  width: 100%;
  height: 100vh;
  display: block;
  min-height: 900px;
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
  color: #6f1f6f;
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
