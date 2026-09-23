import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { clsx } from "clsx";

export type GradientType = "mesh" | "conic" | "blobs" | "radial" | "linear";

export interface GradientMeshProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Rendering type:
   * - `mesh`: 3D fluid WebGL shader mesh powered by Three.js
   * - `conic`: Smooth animated rotating CSS conic gradient
   * - `blobs`: Organic drifting and morphing color blobs
   * - `radial`: Multi-stop pulsating radial gradient
   * - `linear`: Fluid shifting linear gradient wave
   */
  type?: GradientType;

  /**
   * Color stops (hex, rgb, or hsl).
   * Defaults to the Antrosys brand palette.
   */
  colors?: string[];

  /**
   * Animation speed multiplier (default: 1.0)
   */
  speed?: number;

  /**
   * Blur filter intensity in pixels or CSS string (e.g. 40, "60px", "none").
   * Default: 0 for 3D mesh, 50px for CSS modes.
   */
  blur?: number | string;

  /**
   * Enable mouse / pointer interactivity (reacts to cursor position)
   */
  interactive?: boolean;

  /**
   * Display wireframe geometry in 3D mesh mode
   */
  wireframe?: boolean;

  /**
   * Overlay a subtle film grain noise texture
   */
  grain?: boolean;

  /**
   * Wave / distortion amplitude intensity (default: 1.0)
   */
  intensity?: number;

  /**
   * Foreground content rendered over the gradient background
   */
  children?: React.ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;
}

// Default Antrosys brand palette
const DEFAULT_COLORS = [
  "#7C3AED", // Brand primary purple
  "#06B6D4", // Brand accent cyan
  "#5B21B6", // Primary dark
  "#3B82F6", // Semantic info blue
  "#EDE9FE", // Light lavender tint
];

function hexToRgb(hex: string): [number, number, number] {
  const sanitized = hex.replace("#", "").trim();
  if (sanitized.length === 3) {
    const r = parseInt(sanitized[0] + sanitized[0], 16) / 255;
    const g = parseInt(sanitized[1] + sanitized[1], 16) / 255;
    const b = parseInt(sanitized[2] + sanitized[2], 16) / 255;
    return [r, g, b];
  }
  if (sanitized.length === 6) {
    const r = parseInt(sanitized.slice(0, 2), 16) / 255;
    const g = parseInt(sanitized.slice(2, 4), 16) / 255;
    const b = parseInt(sanitized.slice(4, 6), 16) / 255;
    return [r, g, b];
  }
  return [0.486, 0.227, 0.929]; // default fallback
}

/**
 * GradientMesh - Animated gradient and WebGL 3D mesh background component
 */
export function GradientMesh({
  type = "mesh",
  colors = DEFAULT_COLORS,
  speed = 1,
  blur,
  interactive = true,
  wireframe = false,
  grain = false,
  intensity = 1,
  children,
  className,
  style,
  ...restProps
}: GradientMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Handle pointer tracking for CSS and Three.js modes
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    mouseRef.current.targetX = x;
    mouseRef.current.targetY = 1.0 - y;
    setMousePos({ x: Math.round(x * 100), y: Math.round(y * 100) });
  };

  // Three.js 3D WebGL Mesh Effect
  useEffect(() => {
    if (type !== "mesh" || !canvasRef.current || !containerRef.current) return;

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
        container.clientWidth / (container.clientHeight || 1),
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Parse up to 5 colors into RGB THREE.Vector3
      const colorVecs = [
        new THREE.Vector3(...hexToRgb(colors[0] || DEFAULT_COLORS[0])),
        new THREE.Vector3(...hexToRgb(colors[1] || DEFAULT_COLORS[1])),
        new THREE.Vector3(...hexToRgb(colors[2] || DEFAULT_COLORS[2])),
        new THREE.Vector3(...hexToRgb(colors[3] || DEFAULT_COLORS[3])),
        new THREE.Vector3(...hexToRgb(colors[4] || DEFAULT_COLORS[4])),
      ];

      // Custom GLSL Shader for smooth waving 3D fluid mesh
      const vertexShader = `
        uniform float u_time;
        uniform float u_speed;
        uniform float u_intensity;
        uniform vec2 u_mouse;
        varying vec2 vUv;
        varying float vElevation;

        // Classic Perlin 3D Noise by Stefan Gustavson
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
          float t = u_time * 0.4 * u_speed;

          // Multi-frequency organic wave noise
          float n1 = cnoise(vec3(pos.x * 0.8, pos.y * 0.8, t * 0.5));
          float n2 = cnoise(vec3(pos.x * 1.6 + t * 0.3, pos.y * 1.6 - t * 0.2, t * 0.8));

          // Interactive mouse influence
          float distToMouse = distance(uv, u_mouse);
          float mouseWave = sin(distToMouse * 10.0 - t * 2.0) * exp(-distToMouse * 3.0) * 0.4;

          float elevation = (n1 * 0.5 + n2 * 0.25 + mouseWave) * u_intensity;
          pos.z += elevation;
          vElevation = elevation;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const fragmentShader = `
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform vec3 u_color3;
        uniform vec3 u_color4;
        uniform vec3 u_color5;
        uniform float u_time;
        uniform float u_speed;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          float t = u_time * 0.2 * u_speed;
          vec2 uv = vUv;

          // Color blending based on UV coordinates and elevation wave
          float mix1 = smoothstep(0.0, 0.6, uv.x + sin(uv.y * 4.0 + t) * 0.2);
          float mix2 = smoothstep(0.0, 0.7, uv.y + cos(uv.x * 3.0 - t) * 0.2);
          float mix3 = smoothstep(-0.3, 0.3, vElevation);

          vec3 colA = mix(u_color1, u_color2, mix1);
          vec3 colB = mix(u_color3, u_color4, mix2);
          vec3 finalColor = mix(colA, colB, mix3);

          // Accent color highlight on peaks
          finalColor = mix(finalColor, u_color5, smoothstep(0.2, 0.6, vElevation) * 0.7);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

      const uniforms = {
        u_time: { value: 0 },
        u_speed: { value: speed },
        u_intensity: { value: intensity },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_color1: { value: colorVecs[0] },
        u_color2: { value: colorVecs[1] },
        u_color3: { value: colorVecs[2] },
        u_color4: { value: colorVecs[3] },
        u_color5: { value: colorVecs[4] },
      };

      const geometry = new THREE.PlaneGeometry(7, 4.5, 64, 48);
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
        const elapsedTime = clock.getElapsedTime();
        uniforms.u_time.value = elapsedTime;
        uniforms.u_speed.value = speed;
        uniforms.u_intensity.value = intensity;

        // Smooth mouse lerp
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;
        uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
        animationFrameId = requestAnimationFrame(animate);
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
      console.warn("WebGL Shader Initialization Fallback:", err);
    }
  }, [type, colors, speed, intensity, wireframe]);

  // Determine blur style
  const computedBlur =
    blur !== undefined
      ? typeof blur === "number"
        ? `${blur}px`
        : blur
      : type === "mesh"
        ? "0px"
        : "50px";

  const c0 = colors[0] || DEFAULT_COLORS[0];
  const c1 = colors[1] || DEFAULT_COLORS[1];
  const c2 = colors[2] || DEFAULT_COLORS[2];
  const c3 = colors[3] || DEFAULT_COLORS[3];
  const c4 = colors[4] || DEFAULT_COLORS[4];

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={clsx("relative overflow-hidden w-full h-full min-h-[300px]", className)}
      style={style}
      {...restProps}
    >
      {/* 3D WebGL Shader Mesh Mode */}
      {type === "mesh" && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none block"
          style={{ filter: computedBlur !== "0px" ? `blur(${computedBlur})` : "none" }}
        />
      )}

      {/* Conic Gradient Mode */}
      {type === "conic" && (
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
          style={{
            transform: interactive
              ? `scale(1.2) translate(${(mousePos.x - 50) * 0.1}%, ${(mousePos.y - 50) * 0.1}%)`
              : "scale(1.2)",
            filter: `blur(${computedBlur})`,
          }}
        >
          <div
            className="w-full h-full animate-[spin_20s_linear_infinite]"
            style={{
              animationDuration: `${20 / Math.max(0.1, speed)}s`,
              background: `conic-gradient(from 0deg at 50% 50%, ${c0}, ${c1}, ${c2}, ${c3}, ${c4}, ${c0})`,
            }}
          />
        </div>
      )}

      {/* Blobs Mode */}
      {type === "blobs" && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
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
              opacity: 0.8,
              transform: interactive
                ? `translate(${(mousePos.x - 50) * 0.3}px, ${(mousePos.y - 50) * 0.3}px)`
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
              opacity: 0.85,
              transform: interactive
                ? `translate(${(50 - mousePos.x) * 0.4}px, ${(50 - mousePos.y) * 0.4}px)`
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
              right: "20%",
              background: `radial-gradient(circle, ${c2} 0%, transparent 70%)`,
              opacity: 0.75,
              transform: interactive
                ? `translate(${(mousePos.x - 50) * 0.2}px, ${(mousePos.y - 50) * 0.2}px)`
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
              left: "25%",
              background: `radial-gradient(circle, ${c3} 0%, transparent 70%)`,
              opacity: 0.7,
              transform: interactive
                ? `translate(${(50 - mousePos.x) * 0.25}px, ${(50 - mousePos.y) * 0.25}px)`
                : "none",
            }}
          />
        </div>
      )}

      {/* Radial Mode */}
      {type === "radial" && (
        <div
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
          style={{
            filter: `blur(${computedBlur})`,
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${c0} 0%, ${c1} 25%, ${c2} 50%, ${c3} 75%, ${c4} 100%)`,
          }}
        />
      )}

      {/* Linear Mode */}
      {type === "linear" && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            filter: `blur(${computedBlur})`,
            background: `linear-gradient(${135 + (mousePos.x - 50) * 0.5}deg, ${c0}, ${c1}, ${c2}, ${c3}, ${c4})`,
            backgroundSize: "200% 200%",
          }}
        />
      )}

      {/* Optional Film Grain Texture Overlay */}
      {grain && (
        <div
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Content Layer */}
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}

// Alias export for alternate naming convenience
export const GradientBackground = GradientMesh;
