import * as twgl from 'twgl.js';
import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue';
export interface WebGLShaderState {
  gl: WebGLRenderingContext;
  programInfo: twgl.ProgramInfo;
  bufferInfo: twgl.BufferInfo;
  uniforms: Record<string, any>;
}

export interface WebGLComponentState {
  canvas: Ref<HTMLCanvasElement | null>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  errorMessage: Ref<string>;
  webglState: WebGLShaderState | null;
  animationFrameId: number | null;
  lastFrameTime: number;
  mediaQuery: MediaQueryList | null;
  mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null;
}

export interface WebGLComponentProps {
  maxFps?: number;
  respectReducedMotion?: boolean;
}

export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null && gl !== undefined;
  } catch (e) {
    return false;
  }
}

export function hexToGLSLColor(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r / 255, g / 255, b / 255];
}

export function initializeWebGL(
  canvas: HTMLCanvasElement,
  vertexShader: string,
  fragmentShader: string,
  initialUniforms: Record<string, any>
): WebGLShaderState | null {
  if (!isWebGLSupported()) {
    throw new Error('WebGL is not supported on this device');
  }

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) {
    throw new Error('Failed to get WebGL context');
  }

  const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);
  if (!programInfo) {
    throw new Error('Failed to create shader program');
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const bufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);

  const uniforms = {
    u_resolution: [gl.canvas.width, gl.canvas.height],
    ...initialUniforms,
  };

  return { gl, programInfo, bufferInfo, uniforms };
}

export function renderFrame(
  webglState: WebGLShaderState,
  time: number,
  uniformUpdates: (uniforms: Record<string, any>, time: number) => void
): void {
  const { gl, programInfo, bufferInfo, uniforms } = webglState;

  time *= 0.001; // Convert to seconds

  const needsResize = twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  if (needsResize) {
    uniforms.u_resolution = [gl.canvas.width, gl.canvas.height];
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  uniformUpdates(uniforms, time);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);
}

export function cleanupWebGL(state: WebGLComponentState): void {
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
    state.animationFrameId = null;
  }

  if (state.webglState) {
    const { gl, bufferInfo } = state.webglState;
    if (bufferInfo.attribs) {
      Object.values(bufferInfo.attribs).forEach((attrib: any) => {
        if (attrib.buffer) {
          gl.deleteBuffer(attrib.buffer);
        }
      });
    }
    if (bufferInfo.indices) {
      gl.deleteBuffer(bufferInfo.indices);
    }
    state.webglState = null;
  }

  if (state.mediaQuery && state.mediaQueryHandler) {
    state.mediaQuery.removeEventListener('change', state.mediaQueryHandler);
    state.mediaQuery = null;
    state.mediaQueryHandler = null;
  }
}

export function createErrorHandler(
  hasError: Ref<boolean>,
  errorMessage: Ref<string>,
  isLoading: Ref<boolean>,
  componentName: string
) {
  return function setError(message: string): void {
    hasError.value = true;
    errorMessage.value = message;
    isLoading.value = false;
    console.error(`${componentName} component error:`, message);
  };
}

export function useMotionPreferences(props: WebGLComponentProps) {
  const reducedMotionPreference = ref(false);
  let mediaQuery: MediaQueryList | null = null;
  let mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

  const shouldAnimate = computed(() => {
    if (!props.respectReducedMotion) return true;
    return !reducedMotionPreference.value;
  });

  const setupMotionListener = () => {
    try {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      reducedMotionPreference.value = mediaQuery.matches;

      mediaQueryHandler = (e: MediaQueryListEvent) => {
        reducedMotionPreference.value = e.matches;
      };

      mediaQuery.addEventListener('change', mediaQueryHandler);
    } catch (error) {
      console.warn('Unable to set up reduced motion detection:', error);
      reducedMotionPreference.value = false;
    }

    return { mediaQuery, mediaQueryHandler };
  };

  return {
    shouldAnimate,
    reducedMotionPreference,
    setupMotionListener,
  };
}

// Shared component composable
export function useWebGLComponent(
  props: WebGLComponentProps,
  componentName: string,
  vertexShader: string,
  fragmentShader: string,
  initialUniforms: Record<string, any>,
  uniformUpdates: (uniforms: Record<string, any>, time: number, props: any) => void
) {
  const canvas: Ref<HTMLCanvasElement | null> = ref(null);
  const isLoading = ref(true);
  const hasError = ref(false);
  const errorMessage = ref('');

  let webglState: WebGLShaderState | null = null;
  let animationFrameId: number | null = null;
  let lastFrameTime = 0;

  const { shouldAnimate, setupMotionListener } = useMotionPreferences(props);
  let mediaQuery: MediaQueryList | null = null;
  let mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

  const setError = createErrorHandler(hasError, errorMessage, isLoading, componentName);

  const render = (time: number): void => {
    if (!webglState) return;

    // Frame rate limiting
    if (shouldAnimate.value) {
      const frameInterval = 1000 / (props.maxFps || 60);
      if (time - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = time;
    }

    try {
      renderFrame(webglState, time, (uniforms, time) => uniformUpdates(uniforms, time, props));
    } catch (error) {
      setError(`Render error: ${error}`);
      return;
    }

    if (shouldAnimate.value) {
      animationFrameId = requestAnimationFrame(render);
    }
  };

  const initialize = (): void => {
    if (!canvas.value) {
      setError('Canvas element not found');
      return;
    }

    try {
      webglState = initializeWebGL(canvas.value, vertexShader, fragmentShader, initialUniforms);

      if (webglState) {
        isLoading.value = false;
        animationFrameId = requestAnimationFrame(render);
      }
    } catch (error) {
      setError(`WebGL initialization failed: ${error}`);
    }
  };

  const cleanup = (): void => {
    const state: WebGLComponentState = {
      canvas,
      isLoading,
      hasError,
      errorMessage,
      webglState,
      animationFrameId,
      lastFrameTime,
      mediaQuery,
      mediaQueryHandler,
    };
    cleanupWebGL(state);
    webglState = state.webglState;
    animationFrameId = state.animationFrameId;
    mediaQuery = state.mediaQuery;
    mediaQueryHandler = state.mediaQueryHandler;
  };

  watch(shouldAnimate, (newValue, oldValue) => {
    if (newValue && !oldValue && webglState && !animationFrameId) {
      animationFrameId = requestAnimationFrame(render);
    } else if (!newValue && oldValue && animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  });

  onMounted(() => {
    const motionSetup = setupMotionListener();
    mediaQuery = motionSetup.mediaQuery;
    mediaQueryHandler = motionSetup.mediaQueryHandler;

    initialize();
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    canvas,
    isLoading,
    hasError,
    errorMessage,
    shouldAnimate,
  };
}
