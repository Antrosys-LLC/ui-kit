import React, { useEffect, useRef, useState, useContext, useCallback, useId } from "react";
import * as THREE from "three";
import { clsx } from "clsx";
import { ThemeContext } from "../../../providers/ThemeProvider";

export type GradientMeshBackgroundType = "conic" | "mesh" | "blobs" | "radial";

export interface GradientMeshBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Rendering type:
   * - `conic`: Smooth animated rotating CSS conic gradient (lightweight default)
   * - `mesh`: 3D fluid WebGL shader mesh powered by Three.js
   * - `blobs`: Organic drifting and morphing fluid color blobs
   * - `radial`: Multi-stop interactive radial gradient
   * @default "conic"
   */
  type?: GradientMeshBackgroundType;

  /**
   * Color stops array (CSS colors, hex, rgb, or CSS token variables like 'var(--ant-color-brand-primary)').
   * Defaults to Antrosys brand tokens.
   */
  colors?: string[];

  /**
   * Animation speed multiplier (1 = standard, 0 = static/paused, >1 = faster).
   * @default 1
   */
  speed?: number;

  /**
   * Blur filter intensity in pixels or CSS string (e.g. 50, "40px", "none").
   * Defaults to 50px for CSS modes, 0px for 3D mesh mode.
   */
  blur?: number | string;

  /**
   * Whether to react to pointer / cursor interaction.
   * @default true
   */
  interactive?: boolean;

  /**
   * Distortion wave height factor for 3D mesh mode.
   * @default 1
   */
  intensity?: number;

  /**
   * Subtle film grain noise overlay texture.
   * @default false
   */
  grain?: boolean;

  /**
   * Wireframe geometry rendering in 3D mesh mode.
   * @default false
   */
  wireframe?: boolean;

  /**
   * Foreground content rendered above the background.
   */
  children?: React.ReactNode;

  /**
   * Additional CSS class names.
   */
  className?: string;

  /**
   * Custom inline styles.
   */
  style?: React.CSSProperties;
}

// Antrosys Design Token defaults
const DEFAULT_LIGHT_COLORS = [
  "var(--ant-color-brand-primary, #7C3AED)",
  "var(--ant-color-brand-accent, #06B6D4)",
  "var(--ant-color-brand-primary-dk, #5B21B6)",
  "var(--ant-color-semantic-info, #3B82F6)",
  "var(--ant-color-brand-primary-lt, #EDE9FE)",
];

const DEFAULT_DARK_COLORS = [
  "var(--ant-color-brand-primary, #7C3AED)",
  "var(--ant-color-brand-accent, #06B6D4)",
  "var(--ant-color-neutral-900, #0F172A)",
  "var(--ant-color-brand-primary-dk, #5B21B6)",
  "var(--ant-color-neutral-800, #1E293B)",
];

/**
 * Parses hex or rgb string into normalized RGB numbers [0..1]
 */
function parseCssColorToRgb(color: string): [number, number, number] {
  const trimmed = color.trim();

  // Hex format
  if (trimmed.startsWith("#")) {
    const raw = trimmed.slice(1);
    if (raw.length === 3) {
      return [
        parseInt(raw[0] + raw[0], 16) / 255,
        parseInt(raw[1] + raw[1], 16) / 255,
        parseInt(raw[2] + raw[2], 16) / 255,
      ];
    }
    if (raw.length >= 6) {
      return [
        parseInt(raw.slice(0, 2), 16) / 255,
        parseInt(raw.slice(2, 4), 16) / 255,
        parseInt(raw.slice(4, 6), 16) / 255,
      ];
    }
  }

  // rgb(...) format
  const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10) / 255,
      parseInt(rgbMatch[2], 10) / 255,
      parseInt(rgbMatch[3], 10) / 255,
    ];
  }

  // Fallback purple
  return [0.486, 0.227, 0.929];
}

/**
 * Resolves any CSS color stop (including var(--token, fallback)) into normalized [r, g, b]
 */
function resolveColor(color: string, element?: HTMLElement | null): [number, number, number] {
  if (color.startsWith("var(") && typeof window !== "undefined") {
    // Extract varName and fallback
    const inner = color.slice(4, -1);
    const commaIndex = inner.indexOf(",");
    let varName = inner;
    let fallback = "#7C3AED";

    if (commaIndex !== -1) {
      varName = inner.slice(0, commaIndex).trim();
      fallback = inner.slice(commaIndex + 1).trim();
    }

    if (element) {
      const computed = getComputedStyle(element).getPropertyValue(varName).trim();
      if (computed) {
        return parseCssColorToRgb(computed);
      }
    }
    return parseCssColorToRgb(fallback);
  }

  return parseCssColorToRgb(color);
}

/**
 * GradientMeshBackground - Animated CSS or 3D WebGL mesh background for hero sections.
 */
export function GradientMeshBackground({
  type = "conic",
  colors,
  speed = 1,
  blur,
  interactive = true,
  intensity = 1,
  grain = false,
  wireframe = false,
  children,
  className,
  style,
  ...restProps
}: GradientMeshBackgroundProps) {
  const uniqueId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const themeCtx = useContext(ThemeContext);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });

  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
  }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  // Track system preference for reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Track dark theme from ThemeContext or DOM attribute
  useEffect(() => {
    if (themeCtx?.theme) {
      setIsDark(themeCtx.theme === "dark");
      return;
    }
    if (typeof window === "undefined" || !containerRef.current) return;

    const checkDark = () => {
      const el = containerRef.current;
      const doc = document.documentElement;
      setIsDark(
        doc.classList.contains("dark") ||
          doc.getAttribute("data-theme") === "dark" ||
          el?.closest(".dark") !== null ||
          el?.closest("[data-theme='dark']") !== null
      );
    };

    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, [themeCtx?.theme]);

  // Active color palette
  const activeColors =
    colors && colors.length > 0 ? colors : isDark ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS;

  const c0 = activeColors[0] || DEFAULT_LIGHT_COLORS[0];
  const c1 = activeColors[1] || DEFAULT_LIGHT_COLORS[1];
  const c2 = activeColors[2] || DEFAULT_LIGHT_COLORS[2];
  const c3 = activeColors[3] || DEFAULT_LIGHT_COLORS[3];
  const c4 = activeColors[4] || DEFAULT_LIGHT_COLORS[4];

  // Mouse move handler with normalization
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = 1.0 - y;
      setMousePos({ x: Math.round(x * 100), y: Math.round(y * 100) });
    },
    [interactive]
  );

  // Effective rendering mode (fallback to conic if WebGL unsupported or failed)
  const effectiveType = type === "mesh" && webglError ? "conic" : type;

  // Three.js WebGL 3D Mesh Shader Mode
  useEffect(() => {
    if (effectiveType !== "mesh" || !canvasRef.current || !containerRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / Math.max(1, container.clientHeight),
        0.1,
        1000
      );
      camera.position.z = 4.5;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Resolve color stops to RGB vectors
      const rgb0 = resolveColor(c0, container);
      const rgb1 = resolveColor(c1, container);
      const rgb2 = resolveColor(c2, container);
      const rgb3 = resolveColor(c3, container);
      const rgb4 = resolveColor(c4, container);

      // Plane geometry with resolution suitable for smooth organic deformation
      const geometry = new THREE.PlaneGeometry(8, 8, 48, 48);

      // GLSL vertex & fragment shaders for fluid 3D color blobs
      const vertexShader = `
        uniform float u_time;
        uniform float u_speed;
        uniform float u_intensity;
        uniform vec2 u_mouse;
        varying vec2 vUv;
        varying float vElevation;

        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

        float cnoise(vec3 P){
          vec3 Pi0 = floor(P);
          vec3 Pi1 = Pi0 + vec3(1.0);
          Pi0 = mod(Pi0, 289.0);
          Pi1 = mod(Pi1, 289.0);
          vec3 Pf0 = fract(P);
          vec3 Pf1 = Pf0 - vec3(1.0);
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;

          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);

          vec4 gx0 = ixy0 / 7.0;
          vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);

          vec4 gx1 = ixy1 / 7.0;
          vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);

          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;

          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);

          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          float t = u_time * u_speed * 0.4;
          float noise1 = cnoise(vec3(pos.x * 0.4 + t, pos.y * 0.4, t * 0.5));
          float noise2 = cnoise(vec3(pos.x * 0.8 - t * 0.3, pos.y * 0.8 + t * 0.2, t * 0.2));
          float dist = distance(uv, u_mouse);
          float mouseWave = sin(dist * 8.0 - t * 2.0) * exp(-dist * 2.5) * 0.35;
          float elevation = (noise1 * 0.6 + noise2 * 0.4 + mouseWave) * u_intensity;
          pos.z += elevation;
          vElevation = elevation;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const fragmentShader = `
        uniform vec3 u_color0;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform vec3 u_color3;
        uniform vec3 u_color4;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          float normElevation = clamp((vElevation + 0.6) * 0.8, 0.0, 1.0);
          vec3 colA = mix(u_color0, u_color1, smoothstep(0.0, 0.35, normElevation));
          vec3 colB = mix(u_color2, u_color3, smoothstep(0.35, 0.75, normElevation));
          vec3 finalColor = mix(colA, colB, smoothstep(0.2, 0.8, (vUv.x + vUv.y) * 0.5));
          finalColor = mix(finalColor, u_color4, smoothstep(0.7, 1.0, normElevation) * 0.5);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

      const uniforms = {
        u_time: { value: 0 },
        u_speed: { value: reducedMotion ? 0 : speed },
        u_intensity: { value: intensity },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_color0: { value: new THREE.Vector3(...rgb0) },
        u_color1: { value: new THREE.Vector3(...rgb1) },
        u_color2: { value: new THREE.Vector3(...rgb2) },
        u_color3: { value: new THREE.Vector3(...rgb3) },
        u_color4: { value: new THREE.Vector3(...rgb4) },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        wireframe,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        if (!reducedMotion && speed > 0) {
          uniforms.u_time.value += delta;
        }

        // Smooth cursor interpolation
        const currentMouse = mouseRef.current;
        currentMouse.x += (currentMouse.targetX - currentMouse.x) * 0.06;
        currentMouse.y += (currentMouse.targetY - currentMouse.y) * 0.06;
        uniforms.u_mouse.value.set(currentMouse.x, currentMouse.y);

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const width = container.clientWidth;
        const height = container.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      return () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer?.dispose();
      };
    } catch (err) {
      console.warn("WebGL initialization failed, falling back to CSS:", err);
      setWebglError(true);
    }
  }, [effectiveType, c0, c1, c2, c3, c4, speed, intensity, wireframe, reducedMotion]);

  // Determine blur filter style
  const computedBlur =
    blur !== undefined
      ? typeof blur === "number"
        ? `${blur}px`
        : blur
      : effectiveType === "mesh"
        ? "0px"
        : "50px";

  // Animation duration computed with speed safeguard
  const conicAnimationDuration =
    reducedMotion || speed === 0 ? "0s" : `${(20 / Math.max(0.01, speed)).toFixed(2)}s`;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={clsx("relative overflow-hidden w-full h-full min-h-[320px]", className)}
      style={style}
      {...restProps}
    >
      {/* Decorative Background Container */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Mode 1: 3D WebGL Shader Mesh */}
        {effectiveType === "mesh" && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            style={{
              filter: computedBlur !== "0px" ? `blur(${computedBlur})` : "none",
            }}
          />
        )}

        {/* Mode 2: CSS Conic Gradient (Default Lightweight Mode) */}
        {effectiveType === "conic" && (
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
            style={{
              transform: interactive
                ? `scale(1.25) translate(${((mousePos.x - 50) * 0.08).toFixed(2)}%, ${((mousePos.y - 50) * 0.08).toFixed(2)}%)`
                : "scale(1.25)",
              filter: `blur(${computedBlur})`,
            }}
          >
            <div
              className={clsx(
                "w-full h-full",
                reducedMotion || speed === 0 ? "" : "animate-[spin_20s_linear_infinite]"
              )}
              style={{
                animationDuration: conicAnimationDuration,
                animationPlayState: reducedMotion || speed === 0 ? "paused" : "running",
                background: `conic-gradient(from 0deg at 50% 50%, ${c0}, ${c1}, ${c2}, ${c3}, ${c4}, ${c0})`,
              }}
            />
          </div>
        )}

        {/* Mode 3: Fluid Drifting Color Blobs */}
        {effectiveType === "blobs" && (
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ filter: `blur(${computedBlur})` }}
          >
            {/* Blob 1 */}
            <div
              className="absolute rounded-full transition-transform duration-1000 ease-out"
              style={{
                width: "60%",
                height: "60%",
                top: "-10%",
                left: "-10%",
                background: `radial-gradient(circle, ${c0} 0%, transparent 70%)`,
                opacity: isDark ? 0.9 : 0.8,
                transform: interactive
                  ? `translate(${((mousePos.x - 50) * 0.3).toFixed(1)}px, ${((mousePos.y - 50) * 0.3).toFixed(1)}px)`
                  : "none",
              }}
            />
            {/* Blob 2 */}
            <div
              className="absolute rounded-full transition-transform duration-1000 ease-out"
              style={{
                width: "65%",
                height: "65%",
                bottom: "-15%",
                right: "-10%",
                background: `radial-gradient(circle, ${c1} 0%, transparent 70%)`,
                opacity: isDark ? 0.9 : 0.85,
                transform: interactive
                  ? `translate(${((50 - mousePos.x) * 0.35).toFixed(1)}px, ${((50 - mousePos.y) * 0.35).toFixed(1)}px)`
                  : "none",
              }}
            />
            {/* Blob 3 */}
            <div
              className="absolute rounded-full transition-transform duration-1000 ease-out"
              style={{
                width: "50%",
                height: "50%",
                top: "20%",
                right: "15%",
                background: `radial-gradient(circle, ${c2} 0%, transparent 70%)`,
                opacity: isDark ? 0.85 : 0.75,
                transform: interactive
                  ? `translate(${((mousePos.x - 50) * 0.2).toFixed(1)}px, ${((mousePos.y - 50) * 0.2).toFixed(1)}px)`
                  : "none",
              }}
            />
            {/* Blob 4 */}
            <div
              className="absolute rounded-full transition-transform duration-1000 ease-out"
              style={{
                width: "45%",
                height: "45%",
                bottom: "10%",
                left: "20%",
                background: `radial-gradient(circle, ${c3} 0%, transparent 70%)`,
                opacity: isDark ? 0.85 : 0.7,
                transform: interactive
                  ? `translate(${((50 - mousePos.x) * 0.25).toFixed(1)}px, ${((50 - mousePos.y) * 0.25).toFixed(1)}px)`
                  : "none",
              }}
            />
          </div>
        )}

        {/* Mode 4: Interactive Radial Gradient */}
        {effectiveType === "radial" && (
          <div
            className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
            style={{
              filter: `blur(${computedBlur})`,
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${c0} 0%, ${c1} 25%, ${c2} 50%, ${c3} 75%, ${c4} 100%)`,
            }}
          />
        )}

        {/* Optional Subtle Film Grain Texture Overlay */}
        {grain && (
          <div
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter-${uniqueId}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter-${uniqueId})'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>

      {/* Foreground Content Layer */}
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}
